import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import EditBaptismForm from './edit-baptism-form'
import type { UpdateBaptism } from '@/services/baptism/baptism.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateBaptismSchema } from '@/services/baptism/baptism.dto'

type EditBaptismDialogProps = {
  baptism: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditBaptismDialog = ({
  baptism,
  open,
  onOpenChange,
}: EditBaptismDialogProps) => {
  const form = useForm<UpdateBaptism>({
    resolver: standardSchemaResolver(updateBaptismSchema),
    defaultValues: {
      id: baptism.id?.toString(),
      baptismNumber: baptism.baptismNumber,
      memberId: baptism.memberId?.toString() ?? '',
      firstName: baptism.firstName,
      middleName: baptism.middleName,
      lastName: baptism.lastName,
      placeOfBirth: baptism.placeOfBirth,
      homeDistrict: baptism.homeDistrict,
      baptismDate: baptism.baptismDate
        ? new Date(baptism.baptismDate)
        : undefined,
      placeOfBaptism: baptism.placeOfBaptism,
      godParent: baptism.godParent,
      revMinister: baptism.revMinister,
      fathersName: baptism.fathersName,
      mothersName: baptism.mothersName,
      dateOfBirth: baptism.dateOfBirth
        ? new Date(baptism.dateOfBirth)
        : undefined,
      isMember: Boolean(baptism.memberId),
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Baptism Record</DialogTitle>
        </DialogHeader>
        <EditBaptismForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditBaptismDialog
