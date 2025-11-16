import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type EventDetailsProps = {
  event: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EventDetails = ({ event, open, onOpenChange }: EventDetailsProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
      <DialogHeader>
        <DialogTitle>Event Details</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(100vh_-_200px)]">
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-base">{event.name || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <Badge variant={event.isActive ? 'default' : 'secondary'}>
                {event.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="space-y-2 col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-base">{event.description || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Event Date
              </p>
              <p className="text-base">
                {event.eventDate
                  ? format(new Date(event.eventDate), 'PPP')
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Venue</p>
              <p className="text-base">{event.venue || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Society
              </p>
              <p className="text-base">
                {event.society?.name || event.societyName || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Alerts Enabled
              </p>
              <Badge variant={event.addAlert ? 'default' : 'secondary'}>
                {event.addAlert ? 'Yes' : 'No'}
              </Badge>
            </div>
            {event.addAlert ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Frequency
                  </p>
                  <p className="text-base">{event.frequency || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Alert Start Date
                  </p>
                  <p className="text-base">{event.alertStartDate || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Alert Time
                  </p>
                  <p className="text-base">{event.alertTime || 'N/A'}</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
)

export default EventDetails

