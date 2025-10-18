import { CheckboxInput } from '@/components/checkbox-input'
import { DateInput } from '@/components/date-input'
import { SelectInput } from '@/components/select-component'
import { TextAreaInput } from '@/components/text-area-Input'
import { TextInput } from '@/components/text-input'
import type { MemberFormField, MemberFormFieldType } from '@/lib/constants'
import type { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form'

type FieldTypeToRenderProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  fieldType: MemberFormFieldType
  field: MemberFormField
  form: UseFormReturn<TFieldValues>
}
export const FieldTypeToRender = <TFieldValues extends FieldValues>({
  control,
  field,
  form,
  fieldType,
}: FieldTypeToRenderProps<TFieldValues>) => {
  console.log(form.formState.errors)
  switch (fieldType) {
    case 'text':
    case 'password':
    case 'email':
    case 'number':
      return (
        <TextInput
          control={control}
          name={field.name as Path<TFieldValues>}
          type={
            field.type as
              | 'text'
              | 'password'
              | 'email'
              | 'tel'
              | 'number'
              | 'time'
          }
          placeholder={field.placeholder}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
        />
      )
    case 'select':
      return (
        <SelectInput
          control={control}
          name={field.name as Path<TFieldValues>}
          items={field.options!}
          placeholder={field.placeholder || 'Select an option'}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
        />
      )
    case 'date':
      return (
        <DateInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          placeholder={field.placeholder || 'Select a date'}
        />
      )
    case 'textarea':
      return (
        <TextAreaInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          placeholder={field.placeholder || 'Enter your text'}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          rows={field.rows || 10}
        />
      )
    case 'checkbox':
      return (
        <CheckboxInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
              
        />
      )
    default:
      return null
  }
}

FieldTypeToRender.displayName = 'FieldTypeToRender'
export default FieldTypeToRender
