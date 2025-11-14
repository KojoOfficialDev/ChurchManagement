import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import AddConfirmationForm from './add-confirmation-form'
import type { Confirmation } from '@/services/confirmation/confirmation.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { confirmationSchema } from '@/services/confirmation/confirmation.dto'

const AddConfirmationDialog = () => {
  const form = useForm<Confirmation>({
    resolver: standardSchemaResolver(confirmationSchema),
    defaultValues: {
      confirmationNumber: '',
      memberId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      homeDistrict: '',
      confirmationDate: undefined,
      placeOfConfirmation: '',
      godParent: '',
      revMinister: '',
      isMember: false,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add New Confirmation Record <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Confirmation Record</DialogTitle>
        </DialogHeader>
        <AddConfirmationForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddConfirmationDialog
