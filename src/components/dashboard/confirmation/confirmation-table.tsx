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
import { confirmationQueryOptions } from '@/services/confirmation/queries'
import { Pagination } from '@/components/ui/pagination'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import AddConfirmationDialog from '@/components/dashboard/confirmation/add-confirmation-dialog'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { confirmationMutations } from '@/services/confirmation/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { ConfirmationService } from '@/services/confirmation/confirmation.service'
import EditConfirmationDialog from '@/components/dashboard/confirmation/edit-confirmation-dialog'
import ConfirmationDetails from '@/components/dashboard/confirmation/confirmation-details'
import { BulkUploadDialog } from '@/components/bulk-upload-dialog'

const ConfirmationTable = memo(() => {
  const {
    removeConfirmation: { mutateAsync, isPending },
    bulkUpload: { mutateAsync: bulkUploadAsync, isPending: isBulkUploading },
  } = confirmationMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: confirmationData } = useSuspenseQuery(
    confirmationQueryOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedConfirmations, setSelectedConfirmations] = useState<
    Array<string>
  >([])
  const [editingConfirmation, setEditingConfirmation] = useState<any>(null)
  const [viewingConfirmation, setViewingConfirmation] = useState<any>(null)

  const confirmations = useMemo(() => confirmationData.data, [confirmationData])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: ConfirmationService.getAllConfirmations,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      {
        header: 'Confirmation Number',
        accessor: (item: any) => item.confirmationNumber || '-',
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
        header: 'Home District',
        accessor: (item: any) => item.homeDistrict || '-',
      },
      {
        header: 'God Parent/Sponsor',
        accessor: (item: any) => item.godParent || '-',
      },
      {
        header: 'Rev. Minister',
        accessor: (item: any) => item.revMinister || '-',
      },
      {
        header: 'Place of Confirmation',
        accessor: (item: any) => item.placeOfConfirmation || '-',
      },
      {
        header: 'Confirmation Date',
        accessor: (item: any) =>
          item.confirmationDate
            ? format(new Date(item.confirmationDate), 'MMM dd, yyyy')
            : '-',
      },
    ],
    filename: 'confirmations',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedConfirmations.includes(id)) {
        setSelectedConfirmations((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedConfirmations((prev) => [...prev, id])
      }
    },
    [selectedConfirmations],
  )
  const handleSelectAll = useCallback(() => {
    setSelectedConfirmations(
      confirmations.map((confirmation) => confirmation.id.toString()),
    )
  }, [confirmations])

  const handleDeselectAll = useCallback(() => {
    setSelectedConfirmations([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedConfirmations.length === confirmations.length,
    [selectedConfirmations, confirmations.length],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  if (confirmations.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No confirmation records found"
        description="No confirmation records found"
        buttonText="Add Confirmation"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddConfirmationDialog />
            </Suspense>
          </ErrorBoundary>
        }
        secondaryButtonText="Bulk Import"
        secondaryButtonOnClick={
          <BulkUploadDialog
            entityName="Confirmations"
            templatePath="/confirmation-template.xlsx"
            onUpload={bulkUploadAsync}
            isPending={isBulkUploading}
            trigger={
              <Button
                variant="secondary"
                size="lg"
                className="bg-[#4a1fb71f] hover:bg-[#4a1fb71f] "
              >
                Bulk Import
              </Button>
            }
          />
        }
        secondaryButtonSize="lg"
        media={
          <img
            src="/image-3.svg"
            alt="No confirmation records found"
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
          Confirmation
        </h1>

        <AddConfirmationDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">
              All Confirmation Records
            </h2>

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

                {selectedConfirmations.length > 1 && (
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
            {confirmations.length > 0 ? (
              <Table className="overflow-x-auto">
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
                        NL. Confirmation Number
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Name
                      </span>
                    </TableHead>

                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Confirmation Date
                      </span>
                    </TableHead>

                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Rev. Minister Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Document
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmations.map((confirmation) => (
                    <TableRow
                      key={confirmation.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedConfirmations.includes(
                            confirmation.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(confirmation.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {confirmation.confirmationNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {confirmation.firstName} {confirmation.middleName}{' '}
                          {confirmation.lastName}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {format(
                            confirmation.confirmationDate,
                            'ddd MM, yyyy',
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-[11px]">
                        <span className="font-normal text-gray-800 text-xs">
                          {confirmation.revMinister}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {confirmation.fileUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                confirmation.fileUrl,
                                '_blank',
                                'noopener,noreferrer',
                              )
                            }
                            className="h-8 w-8 p-0"
                          >
                            <DownloadIcon className="w-4 h-4 text-gray-600" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="h-8 w-8 p-0"
                          >
                            <DownloadIcon className="w-4 h-4 text-gray-300" />
                          </Button>
                        )}
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
                              onClick={() =>
                                setViewingConfirmation(confirmation)
                              }
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() =>
                                setEditingConfirmation(confirmation)
                              }
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
                                title="Remove Confirmation Record"
                                description="Are you sure you want to remove this confirmation record?"
                                onConfirm={() => {
                                  mutateAsync(confirmation.id.toString())
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
                  No records found matching your search "{search}"
                </span>
              </div>
            )}
          </div>
        </div>
        <Pagination
          currentPage={confirmationData.page}
          pageSize={confirmationData.pageSize}
          totalCount={confirmationData.totalCount}
          totalPages={confirmationData.totalPages}
          hasPrevious={confirmationData.hasPrevious}
          hasNext={confirmationData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingConfirmation && (
        <EditConfirmationDialog
          confirmation={editingConfirmation}
          open={!!editingConfirmation}
          onOpenChange={(open) => !open && setEditingConfirmation(null)}
        />
      )}

      {viewingConfirmation && (
        <ConfirmationDetails
          confirmation={viewingConfirmation}
          open={!!viewingConfirmation}
          onOpenChange={(open) => !open && setViewingConfirmation(null)}
        />
      )}
    </section>
  )
})

ConfirmationTable.displayName = 'ConfirmationTable'
export default ConfirmationTable
