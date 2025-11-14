import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { EditContributionForm } from './edit-contribution-form'
import type { UpdateContribution } from '@/services/contributions/contributions.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateContributionSchema } from '@/services/contributions/contributions.dto'

type EditContributionDialogProps = {
  contribution: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditContributionDialog = ({
  contribution,
  open,
  onOpenChange,
}: EditContributionDialogProps) => {
  const form = useForm<UpdateContribution>({
    resolver: standardSchemaResolver(updateContributionSchema),
    defaultValues: {
      id: contribution.id,
      name: contribution.name,
      description: contribution.description,
      contributionTypeId: contribution.contributionTypeId,
      amount: contribution.amount,
      channel: contribution.channel,
      reference: contribution.reference,
      mobileNumber: contribution.mobileNumber,
      paymentDate: contribution.paymentDate
        ? new Date(contribution.paymentDate)
        : undefined,
      taxDeductable: contribution.taxDeductable ?? true,
      isActive: contribution.isActive ?? true,
      active: contribution.active ?? true,
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Contribution</DialogTitle>
        </DialogHeader>
        <EditContributionForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditContributionDialog
