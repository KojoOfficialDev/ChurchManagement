import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useState } from 'react'
import type { UpdateAlertTemplate } from '@/services/alerts/alerts.dto'
import { TextAreaInput } from '@/components/text-area-Input'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { updateAlertTemplateSchema } from '@/services/alerts/alerts.dto'
import { useAlertsMutations } from '@/services/alerts/mutations'

type EditTemplateDialogProps = {
  template: UpdateAlertTemplate
  children: React.ReactNode
}
const EditTemplateDialog = ({
  template,
  children,
}: EditTemplateDialogProps) => {
  const [open, setOpen] = useState(false)
  const {
    editAlertTemplate: { mutateAsync },
  } = useAlertsMutations()
  const form = useForm<UpdateAlertTemplate>({
    resolver: standardSchemaResolver(updateAlertTemplateSchema),
    defaultValues: {
      id: template.id,
      name: template.name,
      message: template.message,
      isActive: true,
      active: true,
    },
  })

  const handleEdit = async (data: UpdateAlertTemplate) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
        setOpen(false)
      },
      onError: () => {
        toast.error('Failed to update alert template')
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Alert Template</DialogTitle>
          <DialogDescription className="sr-only">
            Edit an alert template to your alert centre.
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleEdit, () => {
            toast.error('Please fill in all required fields')
          })}
        >
          <TextInput
            control={form.control}
            name="name"
            label="Template Name"
            placeholder="Enter template name"
          />
          <TextAreaInput
            control={form.control}
            name="message"
            label="Template Message"
            placeholder="Enter template message"
          />

          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditTemplateDialog
