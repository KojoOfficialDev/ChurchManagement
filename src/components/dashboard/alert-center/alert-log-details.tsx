import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type AlertLogDetailsProps = {
  message: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertLogDetails = ({
  message,
  open,
  onOpenChange,
}: AlertLogDetailsProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
      <DialogHeader>
        <DialogTitle>Alert Message Details</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(100vh_-_200px)]">
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Message ID
              </p>
              <p className="text-base">{message.id || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Recipient Name
              </p>
              <p className="text-base">{message.recipientName || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Recipient ID
              </p>
              <p className="text-base">{message.recipient || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Phone Number
              </p>
              <p className="text-base">{message.phoneNumber || 'N/A'}</p>
            </div>
            <div className="space-y-2 col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Message
              </p>
              <p className="text-base whitespace-pre-wrap">
                {message.message || 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Message Type
              </p>
              <p className="text-base">{message.messageType || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-base">{message.status || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Delivery Status
              </p>
              <p className="text-base">{message.deliveryStatus || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Sent Date
              </p>
              <p className="text-base">
                {message.sentDate
                  ? format(new Date(message.sentDate), 'PPP p')
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Created Date
              </p>
              <p className="text-base">
                {message.createdDate
                  ? format(new Date(message.createdDate), 'PPP p')
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Created By
              </p>
              <p className="text-base">{message.createdBy || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Modified Date
              </p>
              <p className="text-base">
                {message.modifiedDate
                  ? format(new Date(message.modifiedDate), 'PPP p')
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Modified By
              </p>
              <p className="text-base">{message.modifiedBy || 'N/A'}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
)

export default AlertLogDetails

