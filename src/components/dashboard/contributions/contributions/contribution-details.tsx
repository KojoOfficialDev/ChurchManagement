import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

type ContributionDetailsProps = {
  contribution: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ContributionDetails = ({
  contribution,
  open,
  onOpenChange,
}: ContributionDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Contribution Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh_-_200px)]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{contribution.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={contribution.isActive ? 'default' : 'destructive'}
                >
                  {contribution.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-2 col-span-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="text-base">{contribution.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Contribution Type
                </p>
                <p className="text-base">{contribution.typeName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Amount
                </p>
                <p className="text-base">
                  {formatCurrency(contribution.amount)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Channel
                </p>
                <p className="text-base">{contribution.channel}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Reference
                </p>
                <p className="text-base">{contribution.reference}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Mobile Number
                </p>
                <p className="text-base">{contribution.mobileNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Date
                </p>
                <p className="text-base">
                  {contribution.paymentDate
                    ? format(new Date(contribution.paymentDate), 'PPP')
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Tax Deductible
                </p>
                <Badge
                  variant={contribution.taxDeductable ? 'default' : 'secondary'}
                >
                  {contribution.taxDeductable ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ContributionDetails
