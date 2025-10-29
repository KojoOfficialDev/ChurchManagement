import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import type { ContributionType } from '@/services/contributions/contributions.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { contributionTypeSchema } from '@/services/contributions/contributions.dto'
import AddContributionTypeForm from './add-contribution-type-form'

const AddContributionTypeDialog = () => {
  const form = useForm<ContributionType>({
    resolver: standardSchemaResolver(contributionTypeSchema),
    defaultValues: {
      name: '',
      paymentType: '',
      active: true,
      isCampaign: false,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add Contribution Type <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Contribution Type</DialogTitle>
        </DialogHeader>
        <AddContributionTypeForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddContributionTypeDialog

