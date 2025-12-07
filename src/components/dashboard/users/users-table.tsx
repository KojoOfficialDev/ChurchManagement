import { MoreVerticalIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { AddUserDialog } from './add-user-dialog'
import UserDetails from './user-details'
import EditUserDialog from './edit-user-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getAllUsersOptions } from '@/services/users/queries'
import { useUsersMutations } from '@/services/users/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'

const UsersTable = memo(() => {
  const { data: users } = useSuspenseQuery(getAllUsersOptions())
  const { removeUser } = useUsersMutations()
  const [isEditOpen, setIsEditOpen] = useState(false)

  return (
    <section className="flex flex-col w-full items-start gap-6 mt-8">
      <header className="flex items-center justify-between w-full gap-10">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Users Management
        </h1>

        <AddUserDialog>
          <Button>Add New user</Button>
        </AddUserDialog>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Users</h2>
          </div>

          <div className="w-full overflow-x-auto">
            {users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Full Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Email
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Role
                      </span>
                    </TableHead>
                    <TableHead className="w-[58px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.userName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.accessRole || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size={'icon-lg'}>
                              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                          >
                            <UserDetails user={user}>
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault()
                                }}
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                  View Details
                                </span>
                              </DropdownMenuItem>
                            </UserDetails>
                            <EditUserDialog
                              user={user}
                              open={isEditOpen}
                              onOpenChange={setIsEditOpen}
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                                onSelect={(e) => {
                                  e.preventDefault()
                                  setIsEditOpen(true)
                                }}
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                  Edit
                                </span>
                              </DropdownMenuItem>
                            </EditUserDialog>
                            <AlertDialogComponent
                              title="Remove User"
                              description="Are you sure you want to remove this user? This action cannot be undone."
                              onConfirm={() => {
                                removeUser.mutateAsync(user.id)
                              }}
                              disabled={removeUser.isPending}
                              variant="destructive"
                              confirmText="Remove"
                              cancelText="Cancel"
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-normal text-sm">
                                  Remove
                                </span>
                              </DropdownMenuItem>
                            </AlertDialogComponent>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <span className="font-medium text-xs py-4 px-2 text-muted-foreground">
                  No users found
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

UsersTable.displayName = 'UsersTable'
export default UsersTable
