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
import {
  alertTemplateSchema,
  type CreateAlertTemplate,
} from '@/services/alerts/alerts.dto'
import { useAlertsMutations } from '@/services/alerts/mutations'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AddTemplateDialog = ({ children }: { children: React.ReactNode }) => {
  const {
    createAlertTemplate: { mutateAsync },
  } = useAlertsMutations()
  const form = useForm<CreateAlertTemplate>({
    resolver: standardSchemaResolver(alertTemplateSchema),
    defaultValues: {
      name: '',
      message: '',
      isActive: true,
      active: true,
    },
  })

  const handleSave = async (data: CreateAlertTemplate) => {
    await mutateAsync(data, {
      onSuccess: () => {
        form.reset()
      },
      onError: () => {
        toast.error('Failed to create alert template')
      },
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Alert Template</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new alert template to your alert centre.
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleSave, () => {
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

export default AddTemplateDialog
