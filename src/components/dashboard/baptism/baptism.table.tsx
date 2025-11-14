import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
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
import { useSidebar } from '@/lib/contexts/sidebar.context'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { getBaptismsOptions } from '@/services/baptism/queries'
import { Pagination } from '@/components/ui/pagination'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import AddBaptismDialog from '@/components/dashboard/baptism/add-baptism-dialog'
import EditBaptismDialog from '@/components/dashboard/baptism/edit-baptism-dialog'
import BaptismDetails from '@/components/dashboard/baptism/baptism-details'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useBaptismsMutations } from '@/services/baptism/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { BaptismService } from '@/services/baptism/baptism.service'

const BaptismTable = memo(() => {
  const {
    removeBaptism: { mutateAsync, isPending },
  } = useBaptismsMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: baptismsData } = useSuspenseQuery(
    getBaptismsOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedBaptisms, setSelectedBaptisms] = useState<Array<string>>([])
  const [editingBaptism, setEditingBaptism] = useState<any>(null)
  const [viewingBaptism, setViewingBaptism] = useState<any>(null)

  const baptisms = useMemo(() => baptismsData.data, [baptismsData])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: BaptismService.getAllBaptisms,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      {
        header: 'Baptism Number',
        accessor: (item: any) => item.baptismNumber || '-',
      },
      {
        header: 'Is Member',
        accessor: (item: any) => (item.isMember ? 'Yes' : 'No'),
      },
      { header: 'Member ID', accessor: (item: any) => item.memberId || '-' },
      { header: 'First Name', accessor: (item: any) => item.firstName || '-' },
      {
        header: 'Middle Name',
        accessor: (item: any) => item.middleName || '-',
      },
      { header: 'Last Name', accessor: (item: any) => item.lastName || '-' },
      {
        header: 'Full Name',
        accessor: (item: any) =>
          `${item.firstName || ''} ${item.middleName ? item.middleName + ' ' : ''}${item.lastName || ''}`.trim(),
      },
      {
        header: 'Date of Birth',
        accessor: (item: any) =>
          item.dateOfBirth
            ? format(new Date(item.dateOfBirth), 'MMM dd, yyyy')
            : '-',
      },
      {
        header: 'Place of Birth',
        accessor: (item: any) => item.placeOfBirth || '-',
      },
      {
        header: 'Home District',
        accessor: (item: any) => item.homeDistrict || '-',
      },
      { header: 'God Parent', accessor: (item: any) => item.godParent || '-' },
      {
        header: 'Rev. Minister',
        accessor: (item: any) => item.revMinister || '-',
      },
      {
        header: 'Fathers Name',
        accessor: (item: any) => item.fathersName || '-',
      },
      {
        header: 'Mothers Name',
        accessor: (item: any) => item.mothersName || '-',
      },
      {
        header: 'Place of Baptism',
        accessor: (item: any) => item.placeOfBaptism || '-',
      },
      {
        header: 'Baptism Date',
        accessor: (item: any) =>
          item.baptismDate
            ? format(new Date(item.baptismDate), 'MMM dd, yyyy')
            : '-',
      },
    ],
    filename: 'baptisms',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedBaptisms.includes(id)) {
        setSelectedBaptisms((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedBaptisms((prev) => [...prev, id])
      }
    },
    [selectedBaptisms],
  )
  const handleSelectAll = useCallback(() => {
    setSelectedBaptisms(baptisms.map((baptism) => baptism.id.toString()))
  }, [baptisms])

  const handleDeselectAll = useCallback(() => {
    setSelectedBaptisms([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedBaptisms.length === baptisms.length,
    [selectedBaptisms],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [selectedBaptisms])

  if (baptisms.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No baptisms found"
        description="No baptisms found"
        buttonText="Add Baptism"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddBaptismDialog />
            </Suspense>
          </ErrorBoundary>
        }
        media={
          <img
            src="/image-3.svg"
            alt="No baptisms found"
            className="w-full h-full"
          />
        }
      />
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Baptism
        </h1>

        <AddBaptismDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Baptisms</h2>

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <InputGroup>
                  <InputGroupInput
                    placeholder="Search..."
                    className="border-gray-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                </InputGroup>

                {selectedBaptisms.length > 1 && (
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

              <Button
                variant="outline"
                size={isOpen ? 'icon' : 'default'}
                onClick={exportToExcel}
                disabled={isExporting}
              >
                <DownloadIcon className="w-5 h-5" />
                {!isOpen && (
                  <span className="font-medium text-sm">
                    {isExporting ? 'Exporting...' : 'Export'}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            {baptisms.length > 0 ? (
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
                        Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        God Parent
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Place of Baptism
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Baptism Date
                      </span>
                    </TableHead>

                    <TableHead className="px-6 py-3">
                      Rev. Minister Name
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {baptisms.map((baptism) => (
                    <TableRow
                      key={baptism.baptismNumber}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedBaptisms.includes(
                            baptism.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(baptism.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {baptism.lastName} {baptism.middleName}{' '}
                          {baptism.firstName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {baptism.godParent}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {baptism.placeOfBaptism}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {format(baptism.baptismDate, 'do MMMM, yyyy')}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-[11px]">
                        <span className="font-normal text-gray-800 text-xs">
                          {baptism.revMinister}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-auto w-auto p-0"
                            >
                              <MoreVerticalIcon className="w-5 h-5 text-gray-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[149px] bg-[#ffffff] rounded-xl border border-solid border-[#ececec] shadow-[0px_24px_48px_-12px_#0f172814] p-3"
                          >
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setViewingBaptism(baptism)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingBaptism(baptism)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 cursor-pointer"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <AlertDialogComponent
                                title="Remove Baptism Record"
                                description="Are you sure you want to remove this baptism record?"
                                onConfirm={() => {
                                  mutateAsync(baptism.id.toString())
                                }}
                                disabled={isPending}
                                variant="destructive"
                                confirmText="Remove"
                                cancelText="Cancel"
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                  Remove
                                </span>
                              </AlertDialogComponent>
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
                  No records found matching your search "{search}
                </span>
              </div>
            )}
          </div>
        </div>
        <Pagination
          currentPage={baptismsData.page}
          pageSize={baptismsData.pageSize}
          totalCount={baptismsData.totalCount}
          totalPages={baptismsData.totalPages}
          hasPrevious={baptismsData.hasPrevious}
          hasNext={baptismsData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingBaptism && (
        <EditBaptismDialog
          baptism={editingBaptism}
          open={!!editingBaptism}
          onOpenChange={(open) => !open && setEditingBaptism(null)}
        />
      )}

      {viewingBaptism && (
        <BaptismDetails
          baptism={viewingBaptism}
          open={!!viewingBaptism}
          onOpenChange={(open) => !open && setViewingBaptism(null)}
        />
      )}
    </section>
  )
})

BaptismTable.displayName = 'BaptismTable'
export default BaptismTable
