import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { AddEventForm } from './add-event-form'
import type { Event } from '@/services/events/events.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { eventSchema } from '@/services/events/events.dto'

type AddEventDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddEventDialog = ({ open, onOpenChange }: AddEventDialogProps) => {
  const form = useForm<Event>({
    resolver: standardSchemaResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      venue: '',
      eventDate: undefined,
      societyId: undefined,
      isActive: true,
      addAlert: false,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <AddEventForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default AddEventDialog
