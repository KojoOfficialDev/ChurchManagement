import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import type { CreateMarriage } from '@/services/marriages/marriage.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { createMarriageSchema } from '@/services/marriages/marriage.dto'
import AddMarriageForm from '@/components/dashboard/marriage/add-marriage-form'

const AddMarriageDialog = () => {
  const form = useForm<CreateMarriage>({
    resolver: standardSchemaResolver(createMarriageSchema),
    defaultValues: {
      marriageNumber: '',
      coupleName: '',
      placeOfMarriage: '',
      marriageDate: undefined,
      groomId: '',
      groomWitness: '',
      brideId: '',
      brideWitness: '',
      placeOfBirth: '',
      placeOfStay: '',
      homeDistrict: '',
      groomParentName: '',
      brideParentName: '',
      revMinister: '',
    },
  })
  console.log(form.formState.errors)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add New Marriage <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Marriage</DialogTitle>
        </DialogHeader>
        <AddMarriageForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddMarriageDialog
