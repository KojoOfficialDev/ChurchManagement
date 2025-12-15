import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import FieldTypeToRender from '../field-type-to-render'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { FormField, FormSection } from '@/lib/types'
import type { UpdateConfirmation } from '@/services/confirmation/confirmation.dto'
import type { Member } from '@/services/members/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { confirmationMutations } from '@/services/confirmation/mutations'
import { useAssetsMutations } from '@/services/assets/mutations'
import { CONFIRMATION_FORM_SECTIONS } from '@/services/confirmation/confirmation-form'

type EditConfirmationFormProps = {
  form: UseFormReturn<UpdateConfirmation>
  onOpenChange: (open: boolean) => void
}

const EditConfirmationForm = ({
  form,
  onOpenChange,
}: EditConfirmationFormProps) => {
  const {
    updateConfirmation: { mutateAsync, isPending },
  } = confirmationMutations()

  const {
    uploadDocument: { mutateAsync: uploadDocumentAsync },
  } = useAssetsMutations()

  const handleMemberSelect = useCallback(
    (member?: Member) => {
      form.setValue('firstName', member?.firstName ?? '')
      form.setValue('lastName', member?.lastName ?? '')
      form.setValue('middleName', member?.middleName ?? '')
      form.setValue('homeDistrict', member?.homeDistrict ?? '')

      toast.success('Member information loaded successfully')
    },
    [form],
  )

  const section = useMemo(() => {
    const baseSection = CONFIRMATION_FORM_SECTIONS[0]
    const modifiedSection: FormSection = {
      ...baseSection,
      fields: baseSection.fields.map((field) => {
        if (field.name === 'memberId') {
          return {
            ...field,
            onMemberSelect: handleMemberSelect,
          }
        }
        return field
      }),
      childSections: baseSection.childSections?.map((childSection) => ({
        ...childSection,
        fields: childSection.fields.map((field) => {
          if (field.name === 'fileUrl') {
            return {
              ...field,
              onUpload: uploadDocumentAsync,
            }
          }
          return field
        }),
      })),
    }
    return modifiedSection
  }, [handleMemberSelect, uploadDocumentAsync])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(
        field.dependsOn as FieldPath<UpdateConfirmation>,
      )
      return (
        field.dependsOnValue?.some((value) => value === dependsOnValue) ?? false
      )
    },
    [form],
  )

  const shouldShowChildSection = useCallback(
    (childSection: FormSection) => {
      if (!childSection.dependsOn) return true
      const dependsOnValue = form.watch(
        childSection.dependsOn as FieldPath<UpdateConfirmation>,
      )
      return (
        childSection.dependsOnValue?.some(
          (value) => value === dependsOnValue,
        ) ?? false
      )
    },
    [form],
  )

  const handleSave = async (data: UpdateConfirmation) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset(data)
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to update confirmation record')
      },
    })
  }

  return (
    <div className="space-y-6">
      <ScrollArea>
        <form className="space-y-6 h-fit max-h-[calc(100vh_-_260px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => {
              if (!shouldShowField(field)) return null
              return (
                <FieldTypeToRender
                  key={field.name}
                  control={form.control}
                  field={field}
                  form={form}
                  fieldType={field.type}
                />
              )
            })}
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
                  {childSection.fields.map((field) => {
                    if (!shouldShowField(field)) return null
                    return (
                      <FieldTypeToRender
                        key={field.name}
                        control={form.control}
                        field={field}
                        form={form}
                        fieldType={field.type}
                      />
                    )
                  })}
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

export default EditConfirmationForm
