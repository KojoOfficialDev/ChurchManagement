import { useCallback, useMemo } from 'react'
import { type FieldPath, type UseFormReturn } from 'react-hook-form'
import { type CreateMember } from '@/services/members/members.dto'
import type { FormField, FormSection } from '@/lib/types'
import FieldTypeToRender from '../field-type-to-render'
import { ScrollArea } from '@/components/ui/scroll-area'

export type FormSteps =
  | 'Basic Information'
  | 'Background Information'
  | 'Family & Professional Information'
  | 'Membership Information'

type AddMemberFormProps = {
  formStep: FormSteps
  form: UseFormReturn<CreateMember>
  MEMBER_FORM_SECTIONS: Array<FormSection>
}

export const AddMemberForm = ({
  formStep,
  form,
  MEMBER_FORM_SECTIONS,
}: AddMemberFormProps) => {
  const section = useMemo(
    () => MEMBER_FORM_SECTIONS.find((section) => section.title === formStep),
    [formStep],
  )

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(
        field.dependsOn as FieldPath<CreateMember>,
      )
      return field.dependsOnValue?.includes(dependsOnValue)
    },
    [form],
  )
  const shouldShowChildSection = useCallback(
    (childSection: FormSection) => {
      if (!childSection.dependsOn) return true
      const dependsOnValue = form.watch(
        childSection.dependsOn as FieldPath<CreateMember>,
      )
      return childSection.dependsOnValue?.includes(dependsOnValue)
    },
    [form],
  )

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{section?.title}</h3>
      <ScrollArea>
        <form className="space-y-6  h-fit max-h-[calc(100vh_-_260px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section?.fields.map((field) => {
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
          {section?.subSections?.map((subSection) => (
            <div key={subSection.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{subSection.title}</h3>
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
          {section?.childSections?.map((childSection) => {
            if (!shouldShowChildSection(childSection)) return null
            return (
              <div key={childSection.title} className="space-y-4">
                <h4 className="text-md font-semibold">{childSection.title}</h4>
                <div className="grid grid-cols-3 gap-4">
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
    </div>
  )
}

export default AddMemberForm
