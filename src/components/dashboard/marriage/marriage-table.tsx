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
import AddMarriageDialog from '@/components/dashboard/marriage/add-mariage-dialog'
import EditMarriageDialog from '@/components/dashboard/marriage/edit-marriage-dialog'
import MarriageDetails from '@/components/dashboard/marriage/marriage-details'
import { getMarriagesOptions } from '@/services/marriages/queries'
import { Pagination } from '@/components/ui/pagination'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { EmptyComponent } from '@/components/empty-component'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useMarriagesMutations } from '@/services/marriages/mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { MarriageService } from '@/services/marriages/marriage.service'

const MarriageTable = memo(() => {
  const {
    removeMarriage: { mutateAsync, isPending },
  } = useMarriagesMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: marriageResponse } = useSuspenseQuery(
    getMarriagesOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedMarriages, setSelectedMarriages] = useState<Array<string>>([])
  const [editingMarriage, setEditingMarriage] = useState<any>(null)
  const [viewingMarriage, setViewingMarriage] = useState<any>(null)

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: MarriageService.getAllMarriages,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      {
        header: 'Marriage Number',
        accessor: (item: any) => item.marriageNumber || '-',
      },
      {
        header: 'Couple Name',
        accessor: (item: any) => item.coupleName || '-',
      },
      {
        header: 'Groom ID',
        accessor: (item: any) => item.groomId || '-',
      },
      {
        header: 'Groom Name',
        accessor: (item: any) => item.groomName || '-',
      },
      {
        header: 'Groom Witness',
        accessor: (item: any) => item.groomWitness || '-',
      },
      {
        header: 'Groom Parent Name',
        accessor: (item: any) => item.groomParentName || '-',
      },
      {
        header: 'Bride ID',
        accessor: (item: any) => item.brideId || '-',
      },
      {
        header: 'Bride Name',
        accessor: (item: any) => item.brideName || '-',
      },
      {
        header: 'Bride Witness',
        accessor: (item: any) => item.brideWitness || '-',
      },
      {
        header: 'Bride Parent Name',
        accessor: (item: any) => item.brideParentName || '-',
      },
      {
        header: 'Place of Marriage',
        accessor: (item: any) => item.placeOfMarriage || '-',
      },
      {
        header: 'Place of Stay',
        accessor: (item: any) => item.placeOfStay || '-',
      },
      {
        header: 'Rev. Minister',
        accessor: (item: any) => item.revMinister || '-',
      },
      {
        header: 'Marriage Date',
        accessor: (item: any) =>
          item.marriageDate
            ? format(new Date(item.marriageDate), 'MMM dd, yyyy')
            : '-',
      },
    ],
    filename: 'marriages',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedMarriages.includes(id)) {
        setSelectedMarriages((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedMarriages((prev) => [...prev, id])
      }
    },
    [selectedMarriages],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedMarriages(
      marriageResponse.data.map((marriage) => marriage.id.toString()),
    )
  }, [])

  const handleDeselectAll = useCallback(() => {
    setSelectedMarriages([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedMarriages.length === marriageResponse.data.length,
    [selectedMarriages],
  )
  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [selectedMarriages])

  if (marriageResponse.data.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No marriages found"
        description="No marriages found"
        buttonText="Add Marriage"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddMarriageDialog />
            </Suspense>
          </ErrorBoundary>
        }
        media={
          <img
            src="/image-3.svg"
            alt="No marriages found"
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
          Marriage
        </h1>

        <AddMarriageDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h2 className="text-gray-600 font-bold text-xl">All Marriages</h2>

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

                {selectedMarriages.length > 1 && (
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
            {marriageResponse.data.length > 0 ? (
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
                        Marriage Number
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Groom Name
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Bride Name
                      </span>
                    </TableHead>

                    <TableHead className="px-6 py-3">Rev. Minister</TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Document
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marriageResponse.data.map((marriage) => (
                    <TableRow
                      key={marriage.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedMarriages.includes(
                            marriage.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(marriage.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {marriage.marriageNumber}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {marriage.groomId}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {marriage.brideId}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-[11px]">
                        <span className="font-normal text-gray-800 text-xs">
                          {marriage.revMinister}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        {marriage.fileUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(
                                marriage.fileUrl,
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
                              onClick={() => setViewingMarriage(marriage)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingMarriage(marriage)}
                            >
                              <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-dark-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <AlertDialogComponent
                              title="Remove Marriage Record"
                              description="Are you sure you want to remove this marriage record?"
                              onConfirm={() => {
                                mutateAsync(marriage.id.toString())
                              }}
                              disabled={isPending}
                              variant="destructive"
                              confirmText="Remove"
                              cancelText="Cancel"
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-body-text-s-regular font-[number:var(--body-text-s-regular-font-weight)] text-red-700 text-[length:var(--body-text-s-regular-font-size)] tracking-[var(--body-text-s-regular-letter-spacing)] leading-[var(--body-text-s-regular-line-height)] [font-style:var(--body-text-s-regular-font-style)]">
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
                  No records found matching your search "{search}
                </span>
              </div>
            )}
          </div>
        </div>
        <Pagination
          currentPage={marriageResponse.page}
          pageSize={marriageResponse.pageSize}
          totalCount={marriageResponse.totalCount}
          totalPages={marriageResponse.totalPages}
          hasPrevious={marriageResponse.hasPrevious}
          hasNext={marriageResponse.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingMarriage && (
        <EditMarriageDialog
          marriage={editingMarriage}
          open={!!editingMarriage}
          onOpenChange={(open) => !open && setEditingMarriage(null)}
        />
      )}

      {viewingMarriage && (
        <MarriageDetails
          marriage={viewingMarriage}
          open={!!viewingMarriage}
          onOpenChange={(open) => !open && setViewingMarriage(null)}
        />
      )}
    </section>
  )
})

MarriageTable.displayName = 'MarriageTable'
export default MarriageTable
