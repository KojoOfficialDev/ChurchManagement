import { Controller } from 'react-hook-form'
import { useCallback, useState } from 'react'
import {
  DownloadIcon,
  FileIcon,
  Loader2Icon,
  UploadIcon,
  XIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { Label } from './ui/label'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type FileInputProps<TFieldValues extends FieldValues> = {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  placeholder?: string
  labelClassName?: string
  onUpload?: (file: File) => string | Promise<string>
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

const FileInputComponent = <TFieldValues extends FieldValues>({
  label,
  name,
  control,
  error,
  labelClassName,
  onUpload,
  placeholder = 'Upload document',
}: FileInputProps<TFieldValues>) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = (file: File): string | null => {
    // Validate file type
    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return 'Invalid file type. Please upload PDF, DOCX, DOC, JPG, or PNG files.'
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB. Please choose a smaller file.'
    }

    return null
  }

  const handleFileSelect = useCallback(
    async (
      event: React.ChangeEvent<HTMLInputElement>,
      onChange: (value: string) => void,
    ) => {
      const file = event.target.files?.[0]
      if (!file) return

      const validationError = validateFile(file)
      if (validationError) {
        toast.error(validationError)
        event.target.value = ''
        return
      }

      setSelectedFile(file)

      // Upload the file if onUpload is provided
      if (onUpload) {
        try {
          setIsUploading(true)
          const url = await onUpload(file)
          onChange(url)
        } catch (e) {
          console.error('Upload error:', e)
          toast.error('Failed to upload file')
          setSelectedFile(null)
          event.target.value = ''
        } finally {
          setIsUploading(false)
        }
      }
    },
    [onUpload],
  )

  const handleRemove = useCallback(
    (onChange: (value: string) => void, inputRef: HTMLInputElement | null) => {
      setSelectedFile(null)
      onChange('')
      if (inputRef) {
        inputRef.value = ''
      }
    },
    [],
  )

  const handleDownload = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => {
        const hasFile = Boolean(value || selectedFile)
        const fileName =
          selectedFile?.name || (value ? 'Uploaded document' : '')

        return (
          <div className="col-span-2">
            <div className="space-y-3">
              {label && (
                <Label
                  htmlFor={name}
                  className={cn('font-medium', labelClassName)}
                >
                  {label}
                </Label>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploading}
                    className="relative"
                    onClick={() => {
                      const input = document.getElementById(
                        `file-input-${name}`,
                      ) as HTMLInputElement
                      input?.click()
                    }}
                  >
                    {isUploading ? (
                      <>
                        <Loader2Icon className="size-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="size-4 mr-2" />
                        {placeholder}
                      </>
                    )}
                  </Button>
                  <input
                    id={`file-input-${name}`}
                    type="file"
                    accept={Object.values(ACCEPTED_FILE_TYPES).flat().join(',')}
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, onChange)}
                    disabled={isUploading}
                  />
                </div>

                {hasFile && (
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                    <FileIcon className="size-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm flex-1 truncate">{fileName}</span>
                    <div className="flex items-center gap-1">
                      {value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(value)}
                          className="h-8 w-8 p-0"
                        >
                          <DownloadIcon className="size-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemove(
                            onChange,
                            document.getElementById(
                              `file-input-${name}`,
                            ) as HTMLInputElement,
                          )
                        }
                        className="h-8 w-8 p-0"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, DOCX, DOC, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive px-2 mt-2">{error}</p>
            )}
          </div>
        )
      }}
    />
  )
}

const FileInput = FileInputComponent as <TFieldValues extends FieldValues>(
  props: FileInputProps<TFieldValues>,
) => React.JSX.Element

export { FileInput }
