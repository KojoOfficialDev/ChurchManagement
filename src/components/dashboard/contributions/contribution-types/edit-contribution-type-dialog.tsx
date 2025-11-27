import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { EditContributionTypeForm } from './edit-contribution-type-form'
import type { UpdateContributionType } from '@/services/contributions/contributions.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateContributionTypeSchema } from '@/services/contributions/contributions.dto'

type EditContributionTypeDialogProps = {
  contributionType: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditContributionTypeDialog = ({
  contributionType,
  open,
  onOpenChange,
}: EditContributionTypeDialogProps) => {
  const form = useForm<UpdateContributionType>({
    resolver: standardSchemaResolver(updateContributionTypeSchema),
    defaultValues: {
      id: contributionType.id,
      name: contributionType.name,
      paymentType: contributionType.paymentType,
      isActive: contributionType.isActive ?? true,
      active: contributionType.active ?? true,
      isCampaign: contributionType.isCampaign ?? false,
      ...(contributionType.isCampaign && {
        fundRaisingGoal: contributionType.fundRaisingGoal,
        startDate: contributionType.startDate
          ? new Date(contributionType.startDate)
          : undefined,
        endDate: contributionType.endDate
          ? new Date(contributionType.endDate)
          : undefined,
        initialAmount: contributionType.initialAmount,
      }),
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Contribution Type</DialogTitle>
        </DialogHeader>
        <EditContributionTypeForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditContributionTypeDialog







