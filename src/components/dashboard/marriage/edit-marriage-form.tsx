import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import FieldTypeToRender from '../field-type-to-render'
import type { UseFormReturn } from 'react-hook-form'
import type { FormSection } from '@/lib/types'
import type { UpdateMarriage } from '@/services/marriages/marriage.dto'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { useMarriagesMutations } from '@/services/marriages/mutations'
import { useAssetsMutations } from '@/services/assets/mutations'
import { MARRIAGE_FORM_SECTIONS } from '@/services/marriages/marriage.form'

type EditMarriageFormProps = {
  form: UseFormReturn<UpdateMarriage>
  onOpenChange: (open: boolean) => void
}

const EditMarriageForm = ({ form, onOpenChange }: EditMarriageFormProps) => {
  const {
    updateMarriage: { mutateAsync, isPending },
  } = useMarriagesMutations()

  const {
    uploadDocument: { mutateAsync: uploadDocumentAsync },
  } = useAssetsMutations()

  const section = useMemo(() => {
    const baseSection = MARRIAGE_FORM_SECTIONS[0]
    return {
      ...baseSection,
      fields: baseSection.fields.map((field) => {
        if (field.name === 'fileUrl') {
          return {
            ...field,
            onUpload: uploadDocumentAsync,
          }
        }
        return field
      }),
    }
  }, [uploadDocumentAsync])

  const shouldShowChildSection = useCallback(
    (childSection: FormSection) => {
      if (!childSection.dependsOn) return true
      const dependsOnField = childSection.dependsOn as keyof UpdateMarriage
      const dependsOnValue = form.watch(dependsOnField)
      return (
        childSection.dependsOnValue?.some(
          (value) => value === dependsOnValue,
        ) ?? false
      )
    },
    [form],
  )

  const handleSave = async (data: UpdateMarriage) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset(data)
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to update marriage')
      },
    })
  }

  return (
    <div className="space-y-6">
      <ScrollArea>
        <form className="space-y-6 h-fit max-h-[calc(100vh_-_260px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => (
              <FieldTypeToRender
                key={field.name}
                control={form.control}
                field={field}
                form={form}
                fieldType={field.type}
              />
            ))}
          </div>
          {section.subSections?.map((subSection) => (
            <div key={subSection.title} className="space-y-4">
              <h3 className="text-lg font-medium">{subSection.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {subSection.fields.map((field) => (
                  <FieldTypeToRender
                    key={field.name}
                    control={form.control}
                    field={field}
                    form={form}
                    fieldType={field.type}
                  />
                ))}
              </div>
            </div>
          ))}
          {section.childSections?.map((childSection) => {
            if (!shouldShowChildSection(childSection)) return null
            return (
              <div key={childSection.title} className="space-y-4">
                <h4 className="text-md font-medium">{childSection.title}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {childSection.fields.map((field) => (
                    <FieldTypeToRender
                      key={field.name}
                      control={form.control}
                      field={field}
                      form={form}
                      fieldType={field.type}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </form>
      </ScrollArea>
      <DialogFooter className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending} size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          onClick={form.handleSubmit(handleSave, () => {
            toast.error('Please fill in all required fields')
          })}
        >
          {isPending ? 'Updating...' : 'Update'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default EditMarriageForm
