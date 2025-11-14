import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type ConfirmationDetailsProps = {
  confirmation: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ConfirmationDetails = ({
  confirmation,
  open,
  onOpenChange,
}: ConfirmationDetailsProps) => {
  const fullName = `${confirmation.firstName ?? ''} ${
    confirmation.middleName ?? ''
  } ${confirmation.lastName ?? ''}`
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Confirmation Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh_-_200px)]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-base capitalize">{fullName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Confirmation Number
                </p>
                <p className="text-base">
                  {confirmation.confirmationNumber || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Confirmation Date
                </p>
                <p className="text-base">
                  {confirmation.confirmationDate
                    ? format(new Date(confirmation.confirmationDate), 'PPP')
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Place of Confirmation
                </p>
                <p className="text-base">
                  {confirmation.placeOfConfirmation || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Sponsor
                </p>
                <p className="text-base">{confirmation.godParent || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Rev. Minister
                </p>
                <p className="text-base">{confirmation.revMinister || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Home District
                </p>
                <p className="text-base">
                  {confirmation.homeDistrict || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Member
                </p>
                <Badge
                  variant={
                    confirmation.memberId ? 'default' : 'secondary'
                  }
                >
                  {confirmation.memberId
                    ? 'Registered Member'
                    : 'Non Member'}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDetails
