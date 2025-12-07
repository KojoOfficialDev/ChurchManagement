import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { UploadCloud, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import type { ChurchProfile } from '@/services/setup/setup.dto'
import { PhoneInput } from '@/components/phone-input'
import { TextInput } from '@/components/text-input'
import { churchProfileSchema } from '@/services/setup/setup.dto'
import { Label } from '@/components/ui/label'
import { useAssetsMutations } from '@/services/assets/mutations'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useSetupMutations } from '@/services/setup/mutations'
import { churchProfileQuery } from '@/services/setup/queries'

export const ChurchProfileForm = () => {
  const { data } = useSuspenseQuery(churchProfileQuery)
  const {
    uploadImage: { mutate: uploadImageMutation, isPending: isUploading },
  } = useAssetsMutations()
  const {
    updateChurchProfile: {
      mutate: updateChurchProfileMutation,
      isPending: isUpdating,
    },
  } = useSetupMutations()
  const queryClient = useQueryClient()
  const form = useForm<ChurchProfile>({
    resolver: standardSchemaResolver(churchProfileSchema),
    defaultValues: {
      churchContact: data.churchContact || '',
      churchEmail: data.churchEmail || '',
      logoUrl: data.logoUrl || '',
      name: data.name || '',
    },
  })
  const logoInputRef = useRef<HTMLInputElement>(null)
  const logoUrl = form.watch('logoUrl')
  const [previewUrl, setPreviewUrl] = useState<string | null>(logoUrl || null)

  // Sync preview with form's logoUrl value
  useEffect(() => {
    if (logoUrl && !previewUrl) {
      setPreviewUrl(logoUrl)
    }
  }, [logoUrl, previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      handleUpload(file)
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  const handleUpload = (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload JPG, PNG, or JPEG files.')
      return
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File size exceeds 5MB. Please choose a smaller file.')
      return
    }

    // Create preview URL
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    // Upload the file
    uploadImageMutation(file, {
      onSuccess: (url) => {
        // Update form field with the uploaded URL
        form.setValue('logoUrl', url)
        // Clean up the preview URL and use the uploaded URL
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
        setPreviewUrl(url)
      },
      onError: () => {
        // Remove preview on error
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
        setPreviewUrl(null)
      },
    })
  }

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl(null)
    form.setValue('logoUrl', '')
    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }

  const handleSubmit = (formdata: ChurchProfile) => {
    updateChurchProfileMutation(formdata, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: churchProfileQuery.queryKey,
        })
      },
    })
  }
  return (
    <div>
      <div className="w-full max-w-lg bg-white rounded-lg p-8 space-y-4 mt-6">
        <h3 className="text-xl font-semibold">Church Details</h3>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <TextInput
            control={form.control}
            name="name"
            label="Church Name"
            placeholder="Enter Church name "
          />
          <TextInput
            control={form.control}
            name="churchEmail"
            type="email"
            label="Church Email"
            placeholder="Enter Church Email "
          />
          <PhoneInput
            control={form.control}
            name="churchContact"
            label="Church Contact"
            placeholder="Enter Church contact"
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="logo">Church Logo</Label>
            {previewUrl ? (
              <div className="mt-2 relative inline-block">
                <div className="relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                  <img
                    src={previewUrl}
                    alt="Church logo preview"
                    className="w-full h-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Spinner className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className={`w-full py-6 px-4 border-[0.5px] rounded-md text-sm flex items-center justify-between gap-2 ${
                  isUploading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                onClick={() => !isUploading && logoInputRef.current?.click()}
              >
                <input
                  ref={logoInputRef}
                  type="file"
                  id="logo"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <div className="text-muted-foreground">
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isUploading) logoInputRef.current?.click()
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Click to upload'}
                  </button>{' '}
                  or drag and drop
                  <p className="text-[8px] pt-[0.5px]">
                    JPG, PNG, JPEG (max 5MB)
                  </p>
                </div>
                {isUploading ? (
                  <Spinner className="w-6 h-6 text-muted-foreground" />
                ) : (
                  <UploadCloud className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={form.formState.isSubmitting || isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </div>
    </div>
  )
}
