import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import EditEventForm from './edit-event-form'
import type { UpdateEvent } from '@/services/events/events.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateEventSchema } from '@/services/events/events.dto'

type EditEventDialogProps = {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditEventDialog = ({
  event,
  open,
  onOpenChange,
}: EditEventDialogProps) => {
  const form = useForm<UpdateEvent>({
    resolver: standardSchemaResolver(updateEventSchema),
    defaultValues: {
      id: event.id?.toString(),
      name: event.name,
      description: event.description,
      venue: event.venue,
      eventDate: event.eventDate ? new Date(event.eventDate) : undefined,
      societyId: event.societyId ?? event.society?.id,
      isActive: event.isActive ?? true,
      addAlert: event.addAlert ?? false,
      frequency: event.frequency ?? '',
      alertStartDate: event.alertStartDate ?? '',
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <EditEventForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditEventDialog

