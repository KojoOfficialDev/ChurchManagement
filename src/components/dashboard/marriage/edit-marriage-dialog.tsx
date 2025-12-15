import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import EditMarriageForm from './edit-marriage-form'
import type { UpdateMarriage } from '@/services/marriages/marriage.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateMarriageSchema } from '@/services/marriages/marriage.dto'

type EditMarriageDialogProps = {
  marriage: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EditMarriageDialog = ({
  marriage,
  open,
  onOpenChange,
}: EditMarriageDialogProps) => {
  const form = useForm<UpdateMarriage>({
    resolver: standardSchemaResolver(updateMarriageSchema),
    defaultValues: {
      id: marriage.id?.toString(),
      marriageNumber: marriage.marriageNumber,
      coupleName: marriage.coupleName,
      placeOfMarriage: marriage.placeOfMarriage,
      marriageDate: marriage.marriageDate
        ? new Date(marriage.marriageDate)
        : undefined,
      groomId: marriage.groomId?.toString() ?? '',
      groomWitness: marriage.groomWitness,
      brideId: marriage.brideId?.toString() ?? '',
      brideWitness: marriage.brideWitness,
      placeOfStay: marriage.placeOfStay,
      groomParentName: marriage.groomParentName,
      brideParentName: marriage.brideParentName,
      revMinister: marriage.revMinister,
      fileUrl: marriage.fileUrl ?? '',
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Edit Marriage Record</DialogTitle>
        </DialogHeader>
        <EditMarriageForm form={form} onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  )
}

export default EditMarriageDialog
