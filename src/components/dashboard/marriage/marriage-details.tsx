import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

type MarriageDetailsProps = {
  marriage: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MarriageDetails = ({
  marriage,
  open,
  onOpenChange,
}: MarriageDetailsProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
      <DialogHeader>
        <DialogTitle>Marriage Details</DialogTitle>
      </DialogHeader>
      <ScrollArea className="max-h-[calc(100vh_-_200px)]">
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Marriage Number
              </p>
              <p className="text-base">{marriage.marriageNumber || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Couple Name
              </p>
              <p className="text-base">{marriage.coupleName || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Groom Name / ID
              </p>
              <p className="text-base">{marriage.groomId || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Bride Name / ID
              </p>
              <p className="text-base">{marriage.brideId || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Groom Witness
              </p>
              <p className="text-base">{marriage.groomWitness || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Bride Witness
              </p>
              <p className="text-base">{marriage.brideWitness || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Place of Marriage
              </p>
              <p className="text-base">{marriage.placeOfMarriage || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Marriage Date
              </p>
              <p className="text-base">
                {marriage.marriageDate
                  ? format(new Date(marriage.marriageDate), 'PPP')
                  : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Rev. Minister
              </p>
              <p className="text-base">{marriage.revMinister || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Groom Parents
              </p>
              <p className="text-base">{marriage.groomParentName || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Bride Parents
              </p>
              <p className="text-base">{marriage.brideParentName || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Place of Stay
              </p>
              <p className="text-base">{marriage.placeOfStay || 'N/A'}</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
)

export default MarriageDetails
