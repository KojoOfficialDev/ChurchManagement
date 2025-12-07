import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import type { ReactNode } from 'react'
import type { CreateUser } from '@/services/users/users.dto'
import { PhoneInput } from '@/components/phone-input'
import { TextInput } from '@/components/text-input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createUserSchema } from '@/services/users/users.dto'
import { SelectInput } from '@/components/select-component'
import { useUsersMutations } from '@/services/users/mutations'

const allowedRoles = [
  { label: 'Administrator', value: 'Administrator' },
  { label: 'Financial-Secretary', value: 'Financial-Secretary' },
  { label: 'Frontdesk', value: 'Frontdesk' },
]
export const AddUserDialog = ({ children }: { children: ReactNode }) => {
  const { createUser } = useUsersMutations()
  const form = useForm<CreateUser>({
    resolver: standardSchemaResolver(createUserSchema),
    defaultValues: {
      userName: '',
      email: '',
      phoneNumber: '',
      active: true,
      accessRole: '',
      password: '',
    },
  })

  const handleSubmit = (formdata: CreateUser) => {
    createUser.mutateAsync(formdata, {
      onSuccess: () => {
        form.reset()
      },
    })
  }

  console.log(form.formState.errors)
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <TextInput
            control={form.control}
            name="userName"
            label="User Name"
            placeholder="Enter user name"
          />
          <TextInput
            control={form.control}
            name="email"
            label="Email"
            placeholder="Enter email"
          />
          <PhoneInput
            control={form.control}
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter phone number"
          />

          <SelectInput
            control={form.control}
            name="accessRole"
            items={allowedRoles}
            placeholder="Select access role"
          />
          <TextInput
            type="password"
            control={form.control}
            name="password"
            label="Password"
            placeholder="Enter password"
            allowCopy={true}
          />
          <Button type="submit" disabled={createUser.isPending}>
            {createUser.isPending ? 'Adding...' : 'Add User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
