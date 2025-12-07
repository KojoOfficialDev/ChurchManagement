import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod/v3'
import type { ReactNode } from 'react'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { useSocietiesMutations } from '@/services/societies/mutations'

const addSocietySchema = z.object({
  name: z.string().min(1, 'Society Name is Required'),
})
type AddSocietyForm = z.infer<typeof addSocietySchema>
const AddSocietiesDialog = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { createSociety } = useSocietiesMutations()
  const queryClient = getContext().queryClient

  const form = useForm<AddSocietyForm>({
    resolver: zodResolver(addSocietySchema),
    defaultValues: {
      name: '',
    },
  })

  const handleCreateSociety = async (data: AddSocietyForm) => {
    await createSociety.mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        setIsOpen(false)
        queryClient.invalidateQueries({ queryKey: ['societies'] })
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm space-y-4">
        <DialogHeader>
          <DialogTitle>Add Society</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleCreateSociety)}
        >
          <TextInput
            control={form.control}
            name="name"
            label="Society Name"
            placeholder="Enter society name"
            error={form.formState.errors.name?.message}
          />
          <Button type="submit" disabled={createSociety.isPending}>
            {createSociety.isPending ? 'Adding...' : 'Add Society'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddSocietiesDialog
