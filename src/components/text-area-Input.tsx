import { Controller } from 'react-hook-form'
import { Textarea } from './ui/textarea'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { cn } from '@/lib/utils'

type TextAreaInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  placeholder?: string
  required?: boolean
  label?: string
  rows?: number
  error?: string
  name: Path<TFieldValues>
  labelClassName?: string
  className?: string
}
const TextAreaInputComponent = <TFieldValues extends FieldValues>({
  control,
  placeholder,
  error,
  rows = 10,
  name,
  required = false,
  label,
  labelClassName,
  className,
}: TextAreaInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur } }) => (
        <div>
          <div className="space-y-2">
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  `block text-sm font-medium text-foreground `,
                  labelClassName,
                  error && 'text-destructive',
                )}
              >
                {label}
              </label>
            )}

            <Textarea
              aria-invalid={!!error}
              rows={rows}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              id={name}
              placeholder={placeholder}
              className={cn(
                'w-full  py-3',
                error && 'border-2 border-destructive focus:border-0',
                className,
              )}
              required={required}
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
const TextAreaInput = TextAreaInputComponent as <
  TFieldValues extends FieldValues,
>(
  props: TextAreaInputProps<TFieldValues>,
) => React.JSX.Element
export { TextAreaInput }
