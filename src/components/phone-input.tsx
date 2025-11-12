import * as React from 'react'
import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { PhoneNumberInput } from '@/components/ui/phone'

type PhoneInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label: string
  error?: string
  placeholder?: string
  labelClassName?: string
  className?: string
}

const PhoneInputComponent = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  error,
  placeholder,
  labelClassName,
  className,
}: PhoneInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div>
          <div className="space-y-[14px]">
            <Label htmlFor={name} className={cn(labelClassName)}>
              {label}
            </Label>
            <PhoneNumberInput
              aria-invalid={!!error}
              id={name}
              onChange={field.onChange}
              value={field.value}
              placeholder={placeholder}
              defaultCountry="GH"
              className={cn(className)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

const PhoneInput = PhoneInputComponent as <TFieldValues extends FieldValues>(
  props: PhoneInputProps<TFieldValues>,
) => React.JSX.Element

export { PhoneInput }
