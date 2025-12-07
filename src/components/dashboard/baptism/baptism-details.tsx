import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type BaptismDetailsProps = {
  baptism: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const BaptismDetails = ({
  baptism,
  open,
  onOpenChange,
}: BaptismDetailsProps) => {
  const fullName = `${baptism.firstName ?? ''} ${baptism.middleName ?? ''} ${
    baptism.lastName ?? ''
  }`
    .replace(/\s+/g, ' ')
    .trim()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Baptism Details</DialogTitle>
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
                  Baptism Number
                </p>
                <p className="text-base">{baptism.baptismNumber || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Baptism Date
                </p>
                <p className="text-base">
                  {baptism.baptismDate
                    ? format(new Date(baptism.baptismDate), 'PPP')
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Place of Baptism
                </p>
                <p className="text-base">{baptism.placeOfBaptism || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  God Parent
                </p>
                <p className="text-base">{baptism.godParent || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Rev. Minister
                </p>
                <p className="text-base">{baptism.revMinister || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Fathers Name
                </p>
                <p className="text-base">{baptism.fathersName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Mothers Name
                </p>
                <p className="text-base">{baptism.mothersName || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Date of Birth
                </p>
                <p className="text-base">
                  {baptism.dateOfBirth
                    ? format(new Date(baptism.dateOfBirth), 'PPP')
                    : 'N/A'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Place of Birth
                </p>
                <p className="text-base">{baptism.placeOfBirth || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Home District
                </p>
                <p className="text-base">{baptism.homeDistrict || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Member
                </p>
                <Badge variant={baptism.memberId ? 'default' : 'secondary'}>
                  {baptism.memberId ? 'Registered Member' : 'Non Member'}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default BaptismDetails
