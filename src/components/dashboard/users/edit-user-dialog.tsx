import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import type { UpdateUser } from '@/services/users/users.dto'
import type { User } from '@/services/users/types'
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
import { updateUserSchema } from '@/services/users/users.dto'
import { SelectInput } from '@/components/select-component'
import { useUsersMutations } from '@/services/users/mutations'
import { ScrollArea } from '@/components/ui/scroll-area'

const allowedRoles = [
  { label: 'Administrator', value: 'Administrator' },
  { label: 'Financial-Secretary', value: 'Financial-Secretary' },
  { label: 'Frontdesk', value: 'Frontdesk' },
]

type EditUserDialogProps = {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const EditUserDialog = ({
  user,
  open,
  onOpenChange,
  children,
}: EditUserDialogProps) => {
  const { updateUser } = useUsersMutations()
  const [showPasswordField, setShowPasswordField] = useState(false)

  const form = useForm<UpdateUser>({
    resolver: standardSchemaResolver(updateUserSchema),
    defaultValues: {
      id: user.id,
      userName: user.userName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      active: user.active || true,
      accessRole: user.accessRole || '',
      password: undefined,
    },
  })

  const handleSubmit = (formdata: UpdateUser) => {
    // Remove password from data if not changing it
    const dataToSubmit = { ...formdata }
    if (!showPasswordField) {
      delete dataToSubmit.password
    }

    updateUser.mutateAsync(dataToSubmit, {
      onSuccess: () => {
        form.reset()
        setShowPasswordField(false)
        onOpenChange(false)
      },
    })
  }

  const handlePasswordToggle = () => {
    const newState = !showPasswordField
    setShowPasswordField(newState)
    if (!newState) {
      // Clear password field when hiding it
      form.setValue('password', undefined)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[100vh]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <form
            className="flex flex-col gap-4 h-fit max-h-[calc(100vh_-_100px)] p-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <TextInput
              control={form.control}
              name="userName"
              label="User Name"
              placeholder="Enter user name"
              error={form.formState.errors.userName?.message}
            />
            <TextInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="Enter email"
              disabled={true}
              error={form.formState.errors.email?.message}
            />
            <PhoneInput
              control={form.control}
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              error={form.formState.errors.phoneNumber?.message}
            />

            <SelectInput
              control={form.control}
              name="accessRole"
              items={allowedRoles}
              placeholder="Select access role"
              label="Access Role"
              error={form.formState.errors.accessRole?.message}
            />
            <div className="border-t pt-4">
              <div className="flex justify-start">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePasswordToggle}
                  className="mb-4"
                >
                  {showPasswordField
                    ? 'Cancel Password Change'
                    : 'Change Password'}
                </Button>
              </div>

              {showPasswordField && (
                <TextInput
                  type="password"
                  control={form.control}
                  name="password"
                  label="New Password"
                  placeholder="Enter new password"
                  error={form.formState.errors.password?.message}
                />
              )}
            </div>

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateUser.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateUser.isPending}>
                {updateUser.isPending ? 'Updating...' : 'Update User'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default EditUserDialog
