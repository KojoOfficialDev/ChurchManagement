import { MemberSearchInput } from '@/components/member-search-input'
import { MultiSelectInput } from '@/components/multiselect-input'
import { SelectInput } from '@/components/select-component'
import { TextAreaInput } from '@/components/text-area-Input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  alertMessageSchema,
  type CreateAlertMessage,
} from '@/services/alerts/alerts.dto'
import { useAlertsMutations } from '@/services/alerts/mutations'
import { alertTemplatesOptions } from '@/services/alerts/queries'
import { useSocietiesMutations } from '@/services/societies/mutations'
import { getSocietiesOptions } from '@/services/societies/queries'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const AddAlert = ({ children }: { children: React.ReactNode }) => {
  const { data: societies = [] } = useSuspenseQuery(getSocietiesOptions)
  const { data: alertTemplates = [] } = useSuspenseQuery(alertTemplatesOptions)
  const {
    createAlertMessage: { mutateAsync: createAlertMessage },
  } = useAlertsMutations()
  const {
    createSociety: { mutateAsync: createSociety },
  } = useSocietiesMutations()
  const [messageType, setMessageType] = useState<'template' | 'custom'>(
    'template',
  )
  const [messageTemplateId, setMessageTemplateId] = useState<number | null>(
    null,
  )
  const [sendTo, setSendTo] = useState<'member' | 'society' | 'all'>('all')

  const form = useForm<CreateAlertMessage>({
    resolver: standardSchemaResolver(alertMessageSchema),
    defaultValues: {
      message: '',
      memberId: null,
      societyIds: [],
    },
  })
  const handleSendToChange = useCallback(
    (value: string) => {
      if (value === 'member') {
        form.setValue('societyIds', [])
      } else if (value === 'society') {
        form.setValue('memberId', null)
      } else {
        form.setValue('memberId', null)
        form.setValue('societyIds', [])
      }
      setSendTo(value as 'member' | 'society' | 'all')
    },
    [form, setSendTo],
  )
  const handleCreateAlertMessage = useCallback(
    async (data: CreateAlertMessage) => {
      await createAlertMessage(data, {
        onSuccess: () => {
          form.reset()
        },
      })
    },
    [form, createAlertMessage],
  )

  const handleTemplateChange = useCallback(
    (value: string) => {
      setMessageTemplateId(Number(value))
      const template = alertTemplates.find(
        (template) => template.id.toString() === value,
      )
      if (template) {
        form.setValue('message', template.message)
      }
    },
    [form, alertTemplates],
  )

  const handleChangeMessageType = useCallback(() => {
    setMessageTemplateId(null)
    form.setValue('message', '')
    setMessageType(messageType === 'template' ? 'custom' : 'template')
  }, [messageType])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Alert</DialogTitle>
          <DialogDescription className="sr-only">
            Add a new alert to your alert centre.
          </DialogDescription>
        </DialogHeader>
        <form
          className=" flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleCreateAlertMessage)}
          onError={() => {
            toast.error('Please fill in all required fields')
          }}
        >
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="sendTo" className="font-medium">
                Send this alert to :
              </Label>
            </div>
            <RadioGroup
              value={sendTo}
              className="grid grid-cols-3 gap-2"
              onValueChange={handleSendToChange}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">General Congregation</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="member" id="member" />
                <Label htmlFor="member">Specific Member</Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem value="society" id="society" />
                <Label htmlFor="society">Selected Societies</Label>
              </div>
            </RadioGroup>
            {sendTo === 'member' && (
              <MemberSearchInput
                control={form.control}
                name="memberId"
                label="Member"
                placeholder={'Search for a member...'}
                error={form.formState.errors.memberId?.message}
                onMemberSelect={(member) => {
                  form.setValue('memberId', Number(member?.membershipNumber))
                  form.setValue('societyIds', [])
                }}
              />
            )}
            {sendTo === 'society' && (
              <MultiSelectInput
                control={form.control}
                name="societyIds"
                label="Societies"
                items={
                  societies.map((option) => ({
                    label: option.name,
                    value: option.id.toString() || '',
                  })) || []
                }
                placeholder={'Select an option'}
                allowCreate={true}
                createConfig={{
                  onCreate: async (value) => {
                    const response = await createSociety(value)
                    return response
                  },
                }}
                error={form.formState.errors.societyIds?.message}
              />
            )}
          </div>
          <div className="flex gap-3">
            {messageType === 'template' ? (
              <Select
                value={messageTemplateId?.toString() || ''}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a message type" />
                </SelectTrigger>
                <SelectContent>
                  {alertTemplates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id.toString()}
                    >
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <TextAreaInput
                containerClassName="flex-1"
                name="message"
                control={form.control}
                label="Alert Message"
                placeholder="Enter alert message"
              />
            )}
            <button
              type="button"
              className="whitespace-nowrap text-muted-foreground text-sm cursor-pointer"
              onClick={handleChangeMessageType}
            >
              {messageType === 'template'
                ? 'Write a custom message'
                : 'Choose from templates'}
            </button>
          </div>
          {messageType === 'template' && (
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {
                  alertTemplates.find(
                    (template) =>
                      template.id.toString() === messageTemplateId?.toString(),
                  )?.message
                }
              </p>
            </div>
          )}
          <Button>
            {form.formState.isSubmitting ? 'Creating...' : 'Create Alert'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlert
