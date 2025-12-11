import { PlusCircle } from 'lucide-react'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import type { Baptism } from '@/services/baptism/baptism.dto'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { AddBaptismForm } from '@/components/dashboard/baptism/add-baptism-form'
import { baptismSchema } from '@/services/baptism/baptism.dto'

const AddBaptismDialog = () => {
  const form = useForm<Baptism>({
    resolver: standardSchemaResolver(baptismSchema),
    defaultValues: {
      baptismNumber: '',
      memberId: '',
      firstName: '',
      middleName: '',
      lastName: '',
      placeOfBirth: '',
      homeDistrict: '',
      baptismDate: undefined,
      dateOfBirth: undefined,
      placeOfBaptism: '',
      godParent: '',
      revMinister: '',
      fathersName: '',
      mothersName: '',
      fileUrl: '',
      isMember: false,
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'lg'} className="flex items-center gap-2">
          Add New Baptism Record <PlusCircle className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>Add New Baptism Record</DialogTitle>
        </DialogHeader>
        <AddBaptismForm form={form} />
      </DialogContent>
    </Dialog>
  )
}

export default AddBaptismDialog
