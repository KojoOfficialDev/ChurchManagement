import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import FieldTypeToRender from '../../field-type-to-render'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { FormField, FormSection } from '@/lib/types'
import type { UpdateContributionType } from '@/services/contributions/contributions.dto'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { contributionTypesMutations } from '@/services/contributions/contribution-types-mutations'
import { CONTRIBUTION_TYPE_FORM_SECTIONS } from '@/services/contributions/contribution-types-form'

type EditContributionTypeFormProps = {
  form: UseFormReturn<UpdateContributionType>
  onOpenChange: (open: boolean) => void
}

export const EditContributionTypeForm = ({
  form,
  onOpenChange,
}: EditContributionTypeFormProps) => {
  const {
    updateContributionType: { mutateAsync, isPending },
  } = contributionTypesMutations()

  const section = useMemo(() => CONTRIBUTION_TYPE_FORM_SECTIONS[0], [])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(
        field.dependsOn as FieldPath<UpdateContributionType>,
      )
      return field.dependsOnValue?.includes(dependsOnValue)
    },
    [form],
  )

  const shouldShowChildSection = useCallback(
    (childSection: FormSection) => {
      if (!childSection.dependsOn) return true
      const dependsOnValue = form.watch(
        childSection.dependsOn as FieldPath<UpdateContributionType>,
      )
      return childSection.dependsOnValue?.includes(dependsOnValue)
    },
    [form],
  )

  const handleSave = async (data: UpdateContributionType) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to update contribution type')
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

export default EditContributionTypeForm
