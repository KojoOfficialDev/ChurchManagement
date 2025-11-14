import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import AddContributionDialog from './add-contribution-dialog'
import EditContributionDialog from './edit-contribution-dialog'
import ContributionDetails from './contribution-details'
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
import { contributionsQueryOptions } from '@/services/contributions/contributions-queries'
import { Pagination } from '@/components/ui/pagination'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { contributionsMutations } from '@/services/contributions/contributions-mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { ContributionService } from '@/services/contributions/contributions.service'

const ContributionsTable = memo(() => {
  const {
    deleteContribution: { mutateAsync, isPending },
  } = contributionsMutations()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: contributionsData } = useSuspenseQuery(
    contributionsQueryOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedContributions, setSelectedContributions] = useState<
    Array<string>
  >([])
  const [editingContribution, setEditingContribution] = useState<any>(null)
  const [viewingContribution, setViewingContribution] = useState<any>(null)

  const contributions = useMemo(
    () => contributionsData.data,
    [contributionsData],
  )

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: ContributionService.getAllContributions,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      { header: 'Name', accessor: (item: any) => item.name || '-' },
      {
        header: 'Description',
        accessor: (item: any) => item.description || '-',
      },
      {
        header: 'Contribution Type ID',
        accessor: (item: any) => item.contributionTypeId || '-',
      },
      {
        header: 'Amount',
        accessor: (item: any) => item.amount,
      },
      {
        header: 'Amount (Formatted)',
        accessor: (item: any) => formatCurrency(item.amount),
      },
      { header: 'Channel', accessor: (item: any) => item.channel || '-' },
      { header: 'Reference', accessor: (item: any) => item.reference || '-' },
      {
        header: 'Tax Deductible',
        accessor: (item: any) => (item.taxDeductable ? 'Yes' : 'No'),
      },
      {
        header: 'Mobile Number',
        accessor: (item: any) => item.mobileNumber || '-',
      },
      {
        header: 'Payment Date',
        accessor: (item: any) =>
          item.paymentDate
            ? format(new Date(item.paymentDate), 'MMM dd, yyyy')
            : '-',
      },
      {
        header: 'Is Active',
        accessor: (item: any) => (item.isActive ? 'Yes' : 'No'),
      },
      {
        header: 'Active',
        accessor: (item: any) => (item.active ? 'Yes' : 'No'),
      },
    ],
    filename: 'contributions',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedContributions.includes(id)) {
        setSelectedContributions((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedContributions((prev) => [...prev, id])
      }
    },
    [selectedContributions],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedContributions(
      contributions.map((contribution) => contribution.id.toString()),
    )
  }, [contributions])

  const handleDeselectAll = useCallback(() => {
    setSelectedContributions([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedContributions.length === contributions.length,
    [selectedContributions, contributions.length],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  const handleDelete = useCallback(async (id: string) => {
    await mutateAsync(id, {
      onSuccess: () => {
        setSelectedContributions([])
      },
    })
  }, [])

  if (contributions.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No contributions found"
        description="Create a contribution to get started"
        buttonText="Add Contribution"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddContributionDialog />
            </Suspense>
          </ErrorBoundary>
        }
        media={
          <img
            src="/image-3.svg"
            alt="No contributions found"
            className="w-full h-full"
          />
        }
      />
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-gray-800 font-text-lg-bold text-lg font-semibold">
          Contributions
        </h2>
        <AddContributionDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h3 className="text-gray-600 font-bold text-xl">
              All Contributions
            </h3>

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

                {selectedContributions.length > 1 && (
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
            {contributions.length > 0 ? (
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
                        Amount
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Channel
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Payment Date
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Tax Deductible
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((contribution) => (
                    <TableRow
                      key={contribution.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedContributions.includes(
                            contribution.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(contribution.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {contribution.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {formatCurrency(contribution.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {contribution.channel}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {format(contribution.paymentDate, 'MMM dd, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={
                            contribution.taxDeductable ? 'default' : 'secondary'
                          }
                        >
                          {contribution.taxDeductable ? 'Yes' : 'No'}
                        </Badge>
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
                                setViewingContribution(contribution)
                              }
                            >
                              <span className="font-body-text-s-regular">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() =>
                                setEditingContribution(contribution)
                              }
                            >
                              <span className="font-body-text-s-regular">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <AlertDialogComponent
                              title="Delete Contribution"
                              description="Are you sure you want to delete this contribution?"
                              onConfirm={() =>
                                handleDelete(contribution.id.toString())
                              }
                              disabled={isPending}
                              variant="destructive"
                              confirmText="Delete"
                              cancelText="Cancel"
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-body-text-s-regular text-red-700">
                                  Delete
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
                  No records found matching your search "{search}"
                </span>
              </div>
            )}
          </div>
        </div>
        <Pagination
          currentPage={contributionsData.page}
          pageSize={contributionsData.pageSize}
          totalCount={contributionsData.totalCount}
          totalPages={contributionsData.totalPages}
          hasPrevious={contributionsData.hasPrevious}
          hasNext={contributionsData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingContribution && (
        <EditContributionDialog
          contribution={editingContribution}
          open={!!editingContribution}
          onOpenChange={(open) => !open && setEditingContribution(null)}
        />
      )}

      {viewingContribution && (
        <ContributionDetails
          contribution={viewingContribution}
          open={!!viewingContribution}
          onOpenChange={(open) => !open && setViewingContribution(null)}
        />
      )}
    </section>
  )
})

ContributionsTable.displayName = 'ContributionsTable'
export default ContributionsTable
