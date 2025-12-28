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
import { communionQueryOptions } from '@/services/communion/queries'
import { Pagination } from '@/components/ui/pagination'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import AddCommunionDialog from '@/components/dashboard/communion/add-communion-dialog'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { communionMutations } from '@/services/communion/mutation'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { CommunionService } from '@/services/communion/communion.service'
import EditCommunionDialog from '@/components/dashboard/communion/edit-communion-dialog'
import CommunionDetails from '@/components/dashboard/communion/communion-details'
import { BulkUploadDialog } from '@/components/bulk-upload-dialog'

const CommunionTable = memo(() => {
  const {
    removeCommunion: { mutateAsync, isPending },
    bulkUpload: { mutateAsync: bulkUploadAsync, isPending: isBulkUploading },
  } = communionMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: communionData } = useSuspenseQuery(
    communionQueryOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedCommunions, setSelectedCommunions] = useState<Array<string>>(
    [],
  )
  const [editingCommunion, setEditingCommunion] = useState<any>(null)
  const [viewingCommunion, setViewingCommunion] = useState<any>(null)

  const communions = useMemo(() => communionData.data, [communionData])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: CommunionService.getAllCommunions,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      {
        header: 'First Communion Number',
        accessor: (item: any) => item.firstCommunionNumber || '-',
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
        header: 'Rev. Minister',
        accessor: (item: any) => item.revMinister || '-',
      },
      {
        header: 'Place of First Communion',
        accessor: (item: any) => item.placeOfFirstCommunion || '-',
      },
      {
        header: 'First Communion Date',
        accessor: (item: any) =>
          item.firstCommunionDate
            ? format(new Date(item.firstCommunionDate), 'MMM dd, yyyy')
            : '-',
      },
    ],
    filename: 'first-communions',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedCommunions.includes(id)) {
        setSelectedCommunions((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedCommunions((prev) => [...prev, id])
      }
    },
    [selectedCommunions],
  )
  const handleSelectAll = useCallback(() => {
    setSelectedCommunions(
      communions.map((communion) => communion.id.toString()),
    )
  }, [communions])

  const handleDeselectAll = useCallback(() => {
    setSelectedCommunions([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedCommunions.length === communions.length,
    [selectedCommunions, communions.length],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  if (communions.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No communion records found"
        description="No communion records found"
        buttonText="Add Communion"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddCommunionDialog />
            </Suspense>
          </ErrorBoundary>
        }
        secondaryButtonText="Bulk Import"
        secondaryButtonOnClick={
          <BulkUploadDialog
            entityName="Communions"
            templatePath="/communion-template.xlsx"
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
            alt="No communion records found"
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
          First Communion
        </h1>

        <AddCommunionDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">
              All Communion Records
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

                {selectedCommunions.length > 1 && (
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
            {communions.length > 0 ? (
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
                        NLC Number
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Place of First Communion
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        First Communion Date
                      </span>
                    </TableHead>

                    <TableHead className="px-6 py-3">
                      Rev. Minister Name
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Document
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communions.map((communion) => (
                    <TableRow
                      key={communion.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedCommunions.includes(
                            communion.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(communion.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {communion.firstCommunionNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {communion.firstName} {communion.middleName}{' '}
                          {communion.lastName}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {communion.placeOfFirstCommunion}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {format(communion.firstCommunionDate, 'ddd MM, yyyy')}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-[11px]">
                        <span className="font-normal text-gray-800 text-xs">
                          {communion.revMinister}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {communion.fileUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                communion.fileUrl,
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
                              onClick={() => setViewingCommunion(communion)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingCommunion(communion)}
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
                                title="Remove Communion Record"
                                description="Are you sure you want to remove this communion record?"
                                onConfirm={() => {
                                  mutateAsync(communion.id.toString())
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
          currentPage={communionData.page}
          pageSize={communionData.pageSize}
          totalCount={communionData.totalCount}
          totalPages={communionData.totalPages}
          hasPrevious={communionData.hasPrevious}
          hasNext={communionData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingCommunion && (
        <EditCommunionDialog
          communion={editingCommunion}
          open={!!editingCommunion}
          onOpenChange={(open) => !open && setEditingCommunion(null)}
        />
      )}

      {viewingCommunion && (
        <CommunionDetails
          communion={viewingCommunion}
          open={!!viewingCommunion}
          onOpenChange={(open) => !open && setViewingCommunion(null)}
        />
      )}
    </section>
  )
})

CommunionTable.displayName = 'CommunionTable'
export default CommunionTable
