import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { MultiSelect } from './multi-select'
import type { SelectCreatableConfig } from '@/lib/types'

type MultiSelectInputProps<TFieldValues extends FieldValues> = {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  placeholder?: string
  labelClassName?: string
  triggerClassName?: string
  items: Array<{ value: string; label: string }>
  disabled?: boolean | ((value?: string | Date) => boolean)
  allowCreate?: boolean
  createConfig?: SelectCreatableConfig
}

const MultiSelectInputComponent = <TFieldValues extends FieldValues>({
  label,
  name,
  control,
  error,
  placeholder,
  labelClassName,
  items,
  allowCreate,
  createConfig,
}: MultiSelectInputProps<TFieldValues>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={cn(label && 'space-y-2')}>
          <div className="space-y-2">
            <Label htmlFor={name} className={cn(labelClassName)}>
              {label}
            </Label>
            <MultiSelect
              options={items}
              value={field.value}
              onValueChange={field.onChange}
              placeholder={placeholder}
              allowCreate={allowCreate}
              onCreate={createConfig?.onCreate}
              className='h-12'
            />
          </div>
          {error && (
            <p className="text-sm text-destructive px-2 -mt-2">{error}</p>
          )}
        </div>
      )}
    />
  )
}

const MultiSelectInput = MultiSelectInputComponent as <
  TFieldValues extends FieldValues,
>(
  props: MultiSelectInputProps<TFieldValues>,
) => React.JSX.Element
export { MultiSelectInput }
