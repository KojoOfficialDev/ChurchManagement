import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import EditCommunionForm from './edit-communion-form'
import type { UpdateCommunion } from '@/services/communion/communion.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateCommunionSchema } from '@/services/communion/communion.dto'

type EditCommunionDialogProps = {
  communion: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditCommunionDialog = ({
  communion,
  open,
  onOpenChange,
}: EditCommunionDialogProps) => {
  const form = useForm<UpdateCommunion>({
    resolver: standardSchemaResolver(updateCommunionSchema),
    defaultValues: {
      id: communion.id?.toString(),
      memberId: communion.memberId?.toString() ?? '',
      firstName: communion.firstName,
      middleName: communion.middleName,
      lastName: communion.lastName,
      homeDistrict: communion.homeDistrict,
      firstCommunionNumber: communion.firstCommunionNumber,
      firstCommunionDate: communion.firstCommunionDate
        ? new Date(communion.firstCommunionDate)
        : undefined,
      placeOfFirstCommunion: communion.placeOfFirstCommunion,
      revMinister: communion.revMinister,
      fileUrl: communion.fileUrl ?? '',
      isMember: Boolean(communion.memberId),
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Communion Record</DialogTitle>
        </DialogHeader>
        <EditCommunionForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditCommunionDialog
