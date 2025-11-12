import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import type { Communion } from '@/services/communion/communion.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { AddCommunionForm } from '@/components/dashboard/communion/add-communion-form'
import { communionSchema } from '@/services/communion/communion.dto'

const AddCommunionDialog = () => {
  const form = useForm<Communion>({
    resolver: standardSchemaResolver(communionSchema),
    defaultValues: {
      firstCommunionNumber: '',
      memberId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      homeDistrict: '',
      firstCommunionDate: undefined,
      placeOfFirstCommunion: '',
      godParent: '',
      revMinister: '',
      isMember: false,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add New Communion Record <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Communion Record</DialogTitle>
        </DialogHeader>
        <AddCommunionForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddCommunionDialog
