import { ImageInput } from '../image-input'
import type { FormField, FormFieldType } from '@/lib/types'
import type { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { CheckboxInput } from '@/components/checkbox-input'
import { DateInput } from '@/components/date-input'
import { PhoneInput } from '@/components/phone-input'
import { SelectInput } from '@/components/select-component'
import { TextAreaInput } from '@/components/text-area-Input'
import { TextInput } from '@/components/text-input'
import { MultiSelectInput } from '@/components/multiselect-input'
import { MemberSearchInput } from '@/components/member-search-input'

type FieldTypeToRenderProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  fieldType: FormFieldType
  field: FormField
  form: UseFormReturn<TFieldValues>
}
export const FieldTypeToRender = <TFieldValues extends FieldValues>({
  control,
  field,
  form,
  fieldType,
}: FieldTypeToRenderProps<TFieldValues>) => {
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
          disabled={
            typeof field.disabled === 'function'
              ? field.disabled(
                  form.getValues(field.name as Path<TFieldValues>) as
                    | string
                    | Date,
                )
              : field.disabled
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
          items={
            field.options?.map((option) => ({
              label: option.label,
              value: option.value.toString() || '',
            })) || []
          }
          placeholder={field.placeholder || 'Select an option'}
          allowCreate={field.allowCreate}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          createConfig={field.createConfig}
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
          disabled={field.disabled}
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
          onChange={(checked) => {
            // Forward cascading: auto-fill dependent fields when checked
            if (checked && field.autoFills) {
              field.autoFills.forEach((fieldName) => {
                form.setValue(fieldName as Path<TFieldValues>, true as any)
              })
            }
            // Reverse cascading: auto-clear dependent fields when unchecked
            if (!checked && field.autoClearsFrom) {
              field.autoClearsFrom.forEach((fieldName) => {
                form.setValue(fieldName as Path<TFieldValues>, false as any)
              })
            }
          }}
        />
      )
    case 'tel':
      return (
        <PhoneInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          placeholder={field.placeholder || 'Enter your phone number'}
        />
      )
    case 'file':
      return (
        <ImageInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          placeholder={field.placeholder || 'Upload image'}
          onUpload={field.onUpload}
        />
      )
    case 'multi-select':
      return (
        <MultiSelectInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          items={
            field.options?.map((option) => ({
              label: option.label,
              value: option.value.toString() || '',
            })) || []
          }
          placeholder={field.placeholder || 'Select an option'}
          allowCreate={field.allowCreate}
          createConfig={field.createConfig}
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
        />
      )
    case 'member-search':
      return (
        <MemberSearchInput
          control={control}
          name={field.name as Path<TFieldValues>}
          label={field.label}
          placeholder={field.placeholder || 'Search for a member...'}
          disabled={
            typeof field.disabled === 'function'
              ? field.disabled(
                  form.getValues(field.name as Path<TFieldValues>) as
                    | string
                    | Date,
                )
              : field.disabled
          }
          error={
            form.formState.errors[field.name as Path<TFieldValues>]
              ?.message as string
          }
          onMemberSelect={field.onMemberSelect}
        />
      )
    default:
      return null
  }
}

FieldTypeToRender.displayName = 'FieldTypeToRender'
export default FieldTypeToRender
