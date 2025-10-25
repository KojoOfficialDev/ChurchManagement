import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { memo, Suspense, useCallback, useMemo, useState } from 'react'
import { useSidebar } from '@/lib/contexts/sidebar.context'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import AddmemberDialog from '@/components/dashboard/members/addmember-dialog'
import { ErrorBoundary } from '@/components/error-boundary'
import { useSuspenseQuery } from '@tanstack/react-query'
import { getAllMembersOptions } from '@/services/members/queries'
import { EmptyComponent } from '@/components/empty-component'
import { Pagination } from '@/components/ui/pagination'

const MembersTable = memo(() => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: memberResponse } = useSuspenseQuery(
    getAllMembersOptions({ page, pageSize }),
  )
  const memberData = memberResponse.data
  const { isOpen } = useSidebar()
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedMembers.includes(id)) {
        setSelectedMembers((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedMembers((prev) => [...prev, id])
      }
    },
    [selectedMembers],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedMembers(memberData.map((member) => member.id.toString()))
  }, [memberData])

  const handleDeselectAll = useCallback(() => {
    setSelectedMembers([])
  }, [memberData])

  const isAllSelected = useMemo(
    () => selectedMembers.length === memberData.length,
    [selectedMembers, memberData],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [selectedMembers, memberData])

  if (memberData.length === 0) {
    return (
      <EmptyComponent
        title="No members found"
        description="No members found"
        buttonText="Add Member"
        buttonOnClick={<AddmemberDialog />}
        media={
          <img
            src="/image-3.svg"
            alt="No members found"
            className="w-full h-full"
          />
        }
      />
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full gap-10">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Members
        </h1>
        <ErrorBoundary level="component">
          <Suspense fallback={<div>Loading...</div>}>
            <AddmemberDialog />
          </Suspense>
        </ErrorBoundary>
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Members</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search..."
                    className="border-gray-500"
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Select>
                  <SelectTrigger className="w-[170px] border-[#cfd4dc] bg-[#ffffff]">
                    <SelectValue>
                      <span className="font-normal text-gray-600 text-sm">
                        All societies
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All societies</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger className="w-[170px] border-[#cfd4dc] bg-[#ffffff]">
                    <SelectValue>
                      <span className="font-normal text-gray-600 text-sm">
                        All Status
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                  </SelectContent>
                </Select>

                {selectedMembers.length > 1 && (
                  <Button
                    variant="destructive"
                    size={isOpen ? 'icon' : 'default'}
                  >
                    <Trash2Icon className="w-5 h-5" />
                    {!isOpen && (
                      <span className="font-medium text-sm">Delete</span>
                    )}
                  </Button>
                )}
              </div>

              <Button variant="outline" size={isOpen ? 'icon' : 'default'}>
                <DownloadIcon className="w-5 h-5" />
                {!isOpen && <span className="font-medium text-sm">Export</span>}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
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
                      Full name
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Email
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Phone Number
                    </span>
                  </TableHead>
                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-gray-800 text-xs">
                      Gender
                    </span>
                  </TableHead>

                  <TableHead className="px-6 py-3">
                    <span className="font-medium text-[#667084] text-xs">
                      Status
                    </span>
                  </TableHead>
                  <TableHead className="w-[58px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberData.map((member) => (
                  <TableRow
                    key={member.id}
                    className="border-b border-[#eaecf0]"
                  >
                    <TableCell className="px-6 py-3">
                      <Checkbox
                        checked={selectedMembers.includes(member.id.toString())}
                        onCheckedChange={() =>
                          toggleSelect(member.id.toString())
                        }
                        className="cursor-pointer"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {member.firstName} {member.lastName}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {member.email}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {member.phone}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <span className="font-normal text-gray-800 text-xs">
                        {member.gender}
                      </span>
                    </TableCell>

                    <TableCell className="px-6 py-[11px]">
                      {member.isActive ? (
                        <Badge className="bg-[#ebfdf2] hover:bg-[#ebfdf2] text-[#037847] border-0 rounded-2xl px-2 py-0.5 h-auto">
                          <div className="w-2 h-2 mr-1.5">
                            <div className="w-1.5 h-1.5 bg-[#14b96c] rounded-[3px]" />
                          </div>
                          <span className="font-medium text-xs">Active</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-[#ffe8e8] hover:bg-[#ffe8e8] text-crimson border-0 rounded-2xl px-2 py-0.5 h-auto">
                          <div className="w-2 h-2 mr-1.5">
                            <div className="w-1.5 h-1.5 bg-crimson rounded-[3px]" />
                          </div>
                          <span className="font-medium text-xs">Inactive</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-auto w-auto p-0">
                            <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                        >
                          <DropdownMenuItem className="h-10 px-2 py-2 bg-gray-100 rounded-lg cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              View Details
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-10 px-2 py-2 rounded-lg cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                              Edit
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="h-10 px-2 py-2 cursor-pointer">
                            <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
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
          </div>
        </div>

        <Pagination
          currentPage={memberResponse.page}
          pageSize={memberResponse.pageSize}
          totalCount={memberResponse.totalCount}
          totalPages={memberResponse.totalPages}
          hasPrevious={memberResponse.hasPrevious}
          hasNext={memberResponse.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </section>
  )
})

MembersTable.displayName = 'MembersTable'
export default MembersTable
