import { useCallback, useMemo } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { toast } from 'sonner'
import { useSuspenseQuery } from '@tanstack/react-query'
import FieldTypeToRender from '../field-type-to-render'
import type { FieldPath, UseFormReturn } from 'react-hook-form'
import type { FormField } from '@/lib/types'
import type { Event } from '@/services/events/events.dto'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { eventsMutations } from '@/services/events/mutations'
import { EVENT_FORM_SECTIONS } from '@/services/events/events-form'
import { getSocietiesOptions } from '@/services/societies/queries'

type AddEventFormProps = {
  form: UseFormReturn<Event>
  onOpenChange: (open: boolean) => void
}

export const AddEventForm = ({ form, onOpenChange }: AddEventFormProps) => {
  const {
    createEvent: { mutateAsync, isPending },
  } = eventsMutations()

  const { data: societies = [] } = useSuspenseQuery(getSocietiesOptions)

  // Enhance the societyId field with options from query
  const section = useMemo(() => {
    const baseSection = EVENT_FORM_SECTIONS[0]
    return {
      ...baseSection,
      fields: baseSection.fields.map((field) => {
        if (field.name === 'societyId') {
          return {
            ...field,
            options: societies.map((society) => ({
              value: society.id,
              label: society.name,
            })),
          }
        }
        return field
      }),
    }
  }, [societies])

  const shouldShowField = useCallback(
    (field: FormField) => {
      if (!field.dependsOn) return true
      const dependsOnValue = form.watch(field.dependsOn as FieldPath<Event>)
      return field.dependsOnValue?.includes(dependsOnValue!)
    },
    [form],
  )

  const handleSave = async (data: Event) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      },
      onError: () => {
        toast.error('Failed to create event')
      },
    })
  }

  return (
    <div className="space-y-6">
      <ScrollArea>
        <form className="space-y-6 h-fit max-h-[calc(100vh_-_260px)] p-4">
          <div className="grid grid-cols-2 gap-4">
            {section.fields.map((field) => {
              if (!shouldShowField(field)) return null
              return (
                <FieldTypeToRender
                  key={field.name}
                  control={form.control}
                  field={field}
                  form={form}
                  fieldType={field.type}
                />
              )
            })}
          </div>
        </form>
      </ScrollArea>
      <DialogFooter className="flex items-center justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline" disabled={isPending} size="lg">
            Cancel
          </Button>
        </DialogClose>
        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          onClick={form.handleSubmit(handleSave, () => {
            toast.error('Please fill in all required fields')
          })}
        >
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </div>
  )
}

export default AddEventForm
