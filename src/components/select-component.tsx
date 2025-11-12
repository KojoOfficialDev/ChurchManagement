import { Controller } from 'react-hook-form'
import { useCallback, useMemo, useState } from 'react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import type { SelectType } from '@/lib/types'
import type { SelectCreatableConfig } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectCreatable,
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
  allowCreate?: boolean
  createConfig?: SelectCreatableConfig
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
  allowCreate = false,
  createConfig,
}: SelectInputProps<TFieldValues>) => {
  const [createdItems, setCreatedItems] = useState<
    Array<{ value: string; label: string }>
  >([])

  const itemsList = useMemo(() => {
    return [...items, ...createdItems]
  }, [items, createdItems])

  const handleValueCreated = useCallback(
    (newValue: SelectType, onChange: (value: string) => void) => {
      onChange(newValue.value)
      console.log('field.value', onChange)
      console.log('newValue', newValue)
      setCreatedItems((prev) => [...prev, newValue])
    },
    [],
  )
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
              {itemsList.length > 0 ? (
                <>
                  {itemsList.map((item, index) => (
                    <SelectItem value={item.value.toString()} key={index}>
                      {item.label}
                    </SelectItem>
                  ))}
                  {allowCreate && (
                    <SelectCreatable
                      config={createConfig!}
                      onValueCreated={(newValue) =>
                        handleValueCreated(newValue, field.onChange)
                      }
                    />
                  )}
                </>
              ) : allowCreate ? (
                <>
                  <SelectCreatable
                    config={createConfig!}
                    onValueCreated={(newValue) =>
                      handleValueCreated(newValue, field.onChange)
                    }
                  />
                </>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground text-center py-2">
                    {empty || 'no items to choose from'}
                  </p>
                </div>
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
