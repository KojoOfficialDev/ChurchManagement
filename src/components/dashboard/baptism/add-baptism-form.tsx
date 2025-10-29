import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import FieldTypeToRender from '../field-type-to-render'
import type {FieldPath, UseFormReturn} from 'react-hook-form';
import type { FormField, FormSection } from '@/lib/types'
import type { Baptism } from '@/services/baptism/baptism.dto'
import type { Member } from '@/services/members/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { useBaptismsMutations } from '@/services/baptism/mutations'
import { BAPTISM_FORM_SECTIONS } from '@/services/baptism/baptism-form'

type AddBaptismFormProps = {
  form: UseFormReturn<Baptism>
}

export const AddBaptismForm = ({ form }: AddBaptismFormProps) => {
  const {
    createBaptism: { mutateAsync, isPending },
  } = useBaptismsMutations()

  // Handler for when a member is selected
  const handleMemberSelect = useCallback(
    (member?: Member) => {
      // Auto-fill form fields with member data
      form.setValue('firstName', member?.firstName ?? '')
      form.setValue('lastName', member?.lastName ?? '')
      form.setValue('middleName', member?.middleName ?? '')
      form.setValue(
        'dateOfBirth',
        member?.dateOfBirth
          ? new Date(member.dateOfBirth)
          : (undefined as unknown as Date),
      )
      form.setValue('placeOfBirth', member?.placeOfBirth ?? '')
      form.setValue('homeDistrict', member?.homeTown ?? '')

      toast.success('Member information loaded successfully')
    },
    [form],
  )

  // this is a single step form so the section in at index 0
  // Modify the section to add the onMemberSelect callback to the memberId field
  const section = useMemo(() => {
    const baseSection = BAPTISM_FORM_SECTIONS[0]
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
    }
    return modifiedSection
  }, [handleMemberSelect])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(field.dependsOn as FieldPath<Baptism>)
      return field.dependsOnValue?.includes(dependsOnValue!)
    },
    [form],
  )

  const shouldShowChildSection = useCallback(
    (childSection: FormSection) => {
      if (!childSection.dependsOn) return true
      const dependsOnValue = form.watch(
        childSection.dependsOn as FieldPath<Baptism>,
      )
      return childSection.dependsOnValue?.includes(dependsOnValue!)
    },
    [form],
  )

  const handleSave = async (data: Baptism) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
      },
      onError: () => {
        toast.error('Failed to create baptism')
      },
    })
  }
  return (
    <div className="space-y-6">
      <ScrollArea>
        <form className="space-y-6  h-fit max-h-[calc(100vh_-_260px)] p-4">
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
          form="add-baptism-form"
          size="lg"
          disabled={isPending}
          onClick={form.handleSubmit(handleSave, () => {
            toast.error('Please fill in all required fields')
          })}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default AddBaptismForm
