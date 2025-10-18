import { useMemo } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { type CreateMember } from '@/services/members/members.dto'
import { MEMBER_FORM_SECTIONS } from '@/lib/constants'
import FieldTypeToRender from './field-type-to-render'
import { ScrollArea } from '@/components/ui/scroll-area'

export type FormSteps =
  | 'Basic Information'
  | 'Background Information'
  | 'Family & Professional Information'
  | 'Baptism & Confirmation Information'
  | 'Membership Information'

type AddMemberFormProps = {
  formStep: FormSteps
  form: UseFormReturn<CreateMember>
}

export const AddMemberForm = ({ formStep, form }: AddMemberFormProps) => {
  const section = useMemo(
    () => MEMBER_FORM_SECTIONS.find((section) => section.title === formStep),
    [formStep],
  )
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{section?.title}</h3>
      <ScrollArea>
        <form className="space-y-6  h-fit max-h-[46vh] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section?.fields.map((field) => (
              <FieldTypeToRender
                control={form.control}
                field={field}
                form={form}
                fieldType={field.type}
              />
            ))}
          </div>
          {section?.subSections?.map((subSection) => (
            <div key={subSection.title} className="space-y-4">
              <h3 className="text-lg font-medium">{subSection.title}</h3>
              <div className="grid grid-cols-2 gap-4">
                {subSection.fields.map((field) => (
                  <FieldTypeToRender
                    control={form.control}
                    field={field}
                    form={form}
                    fieldType={field.type}
                  />
                ))}
              </div>
            </div>
          ))}
        </form>
      </ScrollArea>
    </div>
  )
}

export default AddMemberForm
