import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type ContributionTypeDetailsProps = {
  contributionType: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const ContributionTypeDetails = ({
  contributionType,
  open,
  onOpenChange,
}: ContributionTypeDetailsProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Contribution Type Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh_-_200px)]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Name
                </p>
                <p className="text-base">{contributionType.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Type
                </p>
                <p className="text-base">{contributionType.paymentType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    contributionType.isActive ? 'default' : 'destructive'
                  }
                >
                  {contributionType.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Is Campaign
                </p>
                <Badge
                  variant={
                    contributionType.isCampaign ? 'default' : 'secondary'
                  }
                >
                  {contributionType.isCampaign ? 'Yes' : 'No'}
                </Badge>
              </div>
              {contributionType.isCampaign && (
                <>
                  <div className="space-y-2 col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Campaign Details
                    </p>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Fundraising Goal
                          </p>
                          <p className="text-base">
                            {contributionType.fundRaisingGoal}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Initial Amount
                          </p>
                          <p className="text-base">
                            $
                            {contributionType.initialAmount?.toFixed(2) ||
                              '0.00'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Start Date
                          </p>
                          <p className="text-base">
                            {contributionType.startDate
                              ? format(
                                  new Date(contributionType.startDate),
                                  'PPP',
                                )
                              : 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            End Date
                          </p>
                          <p className="text-base">
                            {contributionType.endDate
                              ? format(
                                  new Date(contributionType.endDate),
                                  'PPP',
                                )
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ContributionTypeDetails
