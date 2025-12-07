import type { User } from '@/services/users/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'

type UserDetailsProps = {
  user: User
  children: React.ReactNode
}

const UserDetails = ({ user, children }: UserDetailsProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-2xl h-fit max-h-[96vh]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh_-_200px)]">
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  User Name
                </p>
                <p className="text-base">{user.userName}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge variant={user.active ? 'default' : 'destructive'}>
                  {user.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-base">{user.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Number
                </p>
                <p className="text-base">{user.phoneNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Access Role
                </p>
                <p className="text-base">{user.accessRole || 'N/A'}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-base">{user.fullName || 'N/A'}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Email Confirmed
                </p>
                <Badge variant={user.emailConfirmed ? 'default' : 'secondary'}>
                  {user.emailConfirmed ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Phone Confirmed
                </p>
                <Badge
                  variant={user.phoneNumberConfirmed ? 'default' : 'secondary'}
                >
                  {user.phoneNumberConfirmed ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default UserDetails
