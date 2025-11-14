import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import type { UserRole, UserStatus } from '@/services/users/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { getAllUsersOptions } from '@/services/users/queries'

const UsersTable = memo(() => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All Category'>(
    'All Category',
  )
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'All Status'>(
    'All Status',
  )
  const debouncedSearch = useDebounce(search, 400)
  const { data: usersResponse } = useSuspenseQuery(
    getAllUsersOptions({
      page,
      pageSize,
      search: debouncedSearch,
      role: roleFilter,
      status: statusFilter,
    }),
  )
  const userData = usersResponse.data
  const [selectedUsers, setSelectedUsers] = useState<Array<string>>([])

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedUsers.includes(id)) {
        setSelectedUsers((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedUsers((prev) => [...prev, id])
      }
    },
    [selectedUsers],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedUsers(userData.map((user) => user.id))
  }, [userData])

  const handleDeselectAll = useCallback(() => {
    setSelectedUsers([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedUsers.length === userData.length && userData.length > 0,
    [selectedUsers, userData],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleSelectAll, handleDeselectAll])

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full gap-10">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Users Management
        </h1>
        <Button className="bg-primary-600 hover:bg-primary-700">
          <span className="font-medium text-sm">Add New user</span>
        </Button>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Users</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search by Name"
                    className="border-gray-500"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Select
                  value={roleFilter}
                  onValueChange={(value) =>
                    setRoleFilter(value as UserRole | 'All Category')
                  }
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Category">All Category</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as UserStatus | 'All Status')
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Status">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {selectedUsers.length > 0 && (
                  <Button variant="destructive" size="default">
                    <Trash2Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">Delete</span>
                  </Button>
                )}
              </div>

              <Button variant="outline" size="default">
                <DownloadIcon className="w-5 h-5" />
                <span className="font-medium text-sm">Export</span>
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            {userData.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#fbfcfc] border-b border-[#eaecf0] hover:bg-[#fbfcfc]">
                    <TableHead className="w-[75px] px-6 py-3">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleSelectAll}
                        className="cursor-pointer"
                      />
                    </TableHead>
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
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Added on
                      </span>
                    </TableHead>
                    <TableHead className="w-[58px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => toggleSelect(user.id)}
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.fullName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.email}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {user.addedOn}
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
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <span className="font-normal text-sm">
                                Remove
                              </span>
                            </DropdownMenuItem>
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
                  No users found matching your search "{search}"
                </span>
              </div>
            )}
          </div>
        </div>

        <Pagination
          currentPage={usersResponse.page}
          pageSize={usersResponse.pageSize}
          totalCount={usersResponse.totalCount}
          totalPages={usersResponse.totalPages}
          hasPrevious={usersResponse.hasPrevious}
          hasNext={usersResponse.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </section>
  )
})

UsersTable.displayName = 'UsersTable'
export default UsersTable
