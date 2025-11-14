import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import EditConfirmationForm from './edit-confirmation-form'
import type { UpdateConfirmation } from '@/services/confirmation/confirmation.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateConfirmationSchema } from '@/services/confirmation/confirmation.dto'

type EditConfirmationDialogProps = {
  confirmation: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditConfirmationDialog = ({
  confirmation,
  open,
  onOpenChange,
}: EditConfirmationDialogProps) => {
  const form = useForm<UpdateConfirmation>({
    resolver: standardSchemaResolver(updateConfirmationSchema),
    defaultValues: {
      id: confirmation.id?.toString(),
      memberId: confirmation.memberId?.toString() ?? '',
      firstName: confirmation.firstName,
      middleName: confirmation.middleName,
      lastName: confirmation.lastName,
      homeDistrict: confirmation.homeDistrict,
      confirmationNumber: confirmation.confirmationNumber,
      confirmationDate: confirmation.confirmationDate
        ? new Date(confirmation.confirmationDate)
        : undefined,
      placeOfConfirmation: confirmation.placeOfConfirmation,
      godParent: confirmation.godParent,
      revMinister: confirmation.revMinister,
      isMember: Boolean(confirmation.memberId),
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Confirmation Record</DialogTitle>
        </DialogHeader>
        <EditConfirmationForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditConfirmationDialog
