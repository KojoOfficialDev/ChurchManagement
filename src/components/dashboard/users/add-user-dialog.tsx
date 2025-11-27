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
import { createUserSchema, type CreateUser } from '@/services/users/users.dto'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

export const AddUserDialog = ({ children }: { children: ReactNode }) => {
  const form = useForm<CreateUser>({
    resolver: standardSchemaResolver(createUserSchema),
    defaultValues: {
      userName: '',
      email: '',
      phoneNumber: '',
      active: true,
      accessRole: '',
    },
  })
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4">
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

          <TextInput
            control={form.control}
            name="accessRole"
            label="Access Role"
            placeholder="Enter access role"
          />
          <Button type="submit">Add User</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
