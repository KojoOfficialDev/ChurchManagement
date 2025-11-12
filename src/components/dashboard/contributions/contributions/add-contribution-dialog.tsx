import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import AddContributionForm from './add-contribution-form'
import type { Contribution } from '@/services/contributions/contributions.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { contributionSchema } from '@/services/contributions/contributions.dto'

const AddContributionDialog = () => {
  const form = useForm<Contribution>({
    resolver: standardSchemaResolver(contributionSchema),
    defaultValues: {
      name: '',
      description: '',
      contributionTypeId: 0,
      amount: 0,
      channel: '',
      reference: '',
      mobileNumber: '',
      paymentDate: undefined,
      taxDeductable: true,
      isActive: true,
      active: true,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add Contribution <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Contribution</DialogTitle>
        </DialogHeader>
        <AddContributionForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddContributionDialog
