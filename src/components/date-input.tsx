import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
type DateInputProps<TFieldValues extends FieldValues> = {
  label: string
  name: Path<TFieldValues>
  control: Control<TFieldValues>
  error?: string
  placeholder?: string
  labelClassName?: string
  triggerClassName?: string
}
const DateInputComponent = <TFieldValues extends FieldValues>({
  label,
  labelClassName,
  triggerClassName,
  name,
  control,
  error,
  placeholder,
}: DateInputProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        console.log('dob', field.value)
        return (
          <div className="flex flex-col gap-3">
            <>
              <Label htmlFor={name} className={cn('px-1', labelClassName)}>
                {label}
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    aria-invalid={!!error}
                    id={name}
                    className={cn(
                      'text-muted-foreground w-full py-2 sm:py-6 text-left justify-between focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-0 aria-invalid:border-1 aria-invalid:border-destructive',
                      field.value && 'text-black dark:text-white',
                      triggerClassName,
                    )}
                  >
                    {field.value
                      ? format(field.value, 'dd/MM/yyyy')
                      : placeholder || 'Select date'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                {error && (
                  <p className="text-sm text-destructive px-2 -mt-2">
                    {error}
                  </p>
                )}
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    captionLayout="dropdown"
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
            </>
          </div>
        )
      }}
    />
  )
}

const DateInput = DateInputComponent as <TFieldValues extends FieldValues>(
  props: DateInputProps<TFieldValues>,
) => React.JSX.Element
export { DateInput }
