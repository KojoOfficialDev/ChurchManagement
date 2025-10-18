import {
  type Control,
  Controller,
  type Path,
  type FieldValues,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type SelectInputProps<TFieldValues extends FieldValues> = {
  items: Array<{ value: string; label: string }>
  placeholder: string
  name: Path<TFieldValues>
  control?: Control<TFieldValues>
  label?: string
  error?: string
  description?: string | null
  labelClassName?: string
  triggerClassName?: string
  empty?: string
}
const SelectInputComponent = <TFieldValues extends FieldValues>({
  items,
  placeholder,
  name,
  control,
  label,
  description = null,
  labelClassName,
  triggerClassName = '',
  empty,
  error,
}: SelectInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn(label && 'space-y-2')}>
          {label && (
            <Label
              htmlFor={name}
              className={cn(
                `block text-sm font-medium text-foreground `,
                labelClassName,
              )}
            >
              {label}
            </Label>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!error}
              className={cn(
                'text-muted-foreground w-full py-2 sm:py-6 focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-0 aria-invalid:border-1 aria-invalid:border-destructive',
                field.value && 'text-black dark:text-white',
                triggerClassName,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <SelectItem value={item.value.toString()} key={index}>
                    {item.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem className="whitespace-wrap" value="">
                  {empty || 'no items to choose from'}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {description && (
            <p className="text-sm text-muted-foreground pt-0.5 px-2">
              {description}
            </p>
          )}
          {/* Error message */}
          {error && (
            <p className="text-sm text-destructive pt-0.5 px-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

const SelectInput = SelectInputComponent as <TFieldValues extends FieldValues>(
  props: SelectInputProps<TFieldValues>,
) => React.JSX.Element

export { SelectInput }
