import * as React from 'react'

import { Label } from '@/components/ui/label'

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import { Checkbox } from './ui/checkbox'

type CheckboxInputProps<TFieldValues extends FieldValues> = {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  labelClassName?: string
  onChange?: (checked: boolean) => void
}
const CheckboxInputComponent = <TFieldValues extends FieldValues>({
  label,
  labelClassName,
  name,
  control,
  error,
  onChange,
}: CheckboxInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <>
            <div className="flex items-center gap-3">
              <Checkbox
                aria-invalid={!!error}
                id={name}
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked)
                  if (onChange) {
                    onChange(checked as boolean)
                  }
                }}
              />
              <Label htmlFor={name} className={cn('px-1', labelClassName)}>
                {label}
              </Label>
            </div>
            {error && (
              <p className="text-sm text-destructive px-2 -mt-2">{error}</p>
            )}
          </>
        )
      }}
    />
  )
}

const CheckboxInput = CheckboxInputComponent as <
  TFieldValues extends FieldValues,
>(
  props: CheckboxInputProps<TFieldValues>,
) => React.JSX.Element
export { CheckboxInput }
