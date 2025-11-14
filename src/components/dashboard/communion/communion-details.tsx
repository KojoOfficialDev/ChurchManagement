import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type CommunionDetailsProps = {
  communion: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CommunionDetails = ({
  communion,
  open,
  onOpenChange,
}: CommunionDetailsProps) => {
  const fullName = `${communion.firstName ?? ''} ${
    communion.middleName ?? ''
  } ${communion.lastName ?? ''}`
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Communion Details</DialogTitle>
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
                  Communion Number
                </p>
                <p className="text-base">
                  {communion.firstCommunionNumber || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  First Communion Date
                </p>
                <p className="text-base">
                  {communion.firstCommunionDate
                    ? format(new Date(communion.firstCommunionDate), 'PPP')
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Place of First Communion
                </p>
                <p className="text-base">
                  {communion.placeOfFirstCommunion || 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Rev. Minister
                </p>
                <p className="text-base">{communion.revMinister || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Home District
                </p>
                <p className="text-base">{communion.homeDistrict || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Member
                </p>
                <Badge
                  variant={
                    communion.memberId ? 'default' : 'secondary'
                  }
                >
                  {communion.memberId
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

export default CommunionDetails
