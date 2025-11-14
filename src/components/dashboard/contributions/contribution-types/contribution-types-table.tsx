import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import AddContributionTypeDialog from './add-contribution-type-dialog'
import EditContributionTypeDialog from './edit-contribution-type-dialog'
import ContributionTypeDetails from './contribution-type-details'
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
import { contributionTypesQueryOptions } from '@/services/contributions/contribution-types-queries'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { Badge } from '@/components/ui/badge'
import { contributionTypesMutations } from '@/services/contributions/contribution-types-mutations'
import { AlertDialogComponent } from '@/components/alert-dialog'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { ContributionTypeService } from '@/services/contributions/contribution-types.service'
import { format } from 'date-fns'

const ContributionTypesTable = memo(() => {
  const [search, setSearch] = useState('')
  const {
    deleteContributionType: { mutateAsync, isPending },
  } = contributionTypesMutations()
  const { data: contributionTypesData = [] } = useSuspenseQuery(
    contributionTypesQueryOptions(),
  )
  const { isOpen } = useSidebar()
  const [selectedTypes, setSelectedTypes] = useState<Array<string>>([])
  const [editingType, setEditingType] = useState<any>(null)
  const [viewingType, setViewingType] = useState<any>(null)

  const contributionTypes = useMemo(() => {
    if (!search) return contributionTypesData
    return contributionTypesData.filter(
      (type) =>
        type.name.toLowerCase().includes(search.toLowerCase()) ||
        type.paymentType.toLowerCase().includes(search.toLowerCase()),
    )
  }, [contributionTypesData, search])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: ContributionTypeService.getAllContributionTypes,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      { header: 'Name', accessor: (item: any) => item.name },
      { header: 'Payment Type', accessor: (item: any) => item.paymentType },
      {
        header: 'Is Active',
        accessor: (item: any) => (item.isActive ? 'Yes' : 'No'),
      },
      {
        header: 'Active',
        accessor: (item: any) => (item.active ? 'Yes' : 'No'),
      },
      {
        header: 'Is Campaign',
        accessor: (item: any) => (item.isCampaign ? 'Yes' : 'No'),
      },
      {
        header: 'Fundraising Goal',
        accessor: (item: any) => item.fundRaisingGoal || '-',
      },
      {
        header: 'Start Date',
        accessor: (item: any) =>
          item.startDate
            ? format(new Date(item.startDate), 'MMM dd, yyyy')
            : '-',
      },
      {
        header: 'End Date',
        accessor: (item: any) =>
          item.endDate ? format(new Date(item.endDate), 'MMM dd, yyyy') : '-',
      },
      {
        header: 'Initial Amount',
        accessor: (item: any) => item.initialAmount || '-',
      },
    ],
    filename: 'contribution-types',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedTypes.includes(id)) {
        setSelectedTypes((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedTypes((prev) => [...prev, id])
      }
    },
    [selectedTypes],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedTypes(contributionTypes.map((type) => type.id.toString()))
  }, [contributionTypes])

  const handleDeselectAll = useCallback(() => {
    setSelectedTypes([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedTypes.length === contributionTypes.length,
    [selectedTypes, contributionTypes.length],
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
        setSelectedTypes([])
      },
    })
  }, [])

  if (contributionTypes.length === 0 && !search) {
    return (
      <div className="border-t">
        <EmptyComponent
          title="No contribution types found"
          description="Create a contribution type to get started"
          buttonText="Add Contribution Type"
          buttonOnClick={
            <ErrorBoundary level="component">
              <Suspense fallback={<ButtonSkeleton />}>
                <AddContributionTypeDialog />
              </Suspense>
            </ErrorBoundary>
          }
        />
      </div>
    )
  }

  return (
    <section className="flex flex-col w-full items-start gap-6">
      <header className="flex items-center justify-between w-full">
        <h2 className="text-gray-800 font-text-lg-bold text-lg font-semibold">
          Contribution Types
        </h2>
        <AddContributionTypeDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h3 className="text-gray-600 font-bold text-xl">
              All Contribution Types
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

                {selectedTypes.length > 1 && (
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
            {contributionTypes.length > 0 ? (
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
                        Payment Type
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Active
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Is Campaign
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributionTypes.map((type) => (
                    <TableRow
                      key={type.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedTypes.includes(type.id.toString())}
                          onCheckedChange={() =>
                            toggleSelect(type.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {type.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {type.paymentType}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={type.isActive ? 'default' : 'secondary'}
                        >
                          {type.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={type.isCampaign ? 'default' : 'outline'}
                        >
                          {type.isCampaign ? 'Yes' : 'No'}
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
                              onClick={() => setViewingType(type)}
                            >
                              <span className="font-body-text-s-regular">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingType(type)}
                            >
                              <span className="font-body-text-s-regular">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <AlertDialogComponent
                              title="Delete Contribution Type"
                              description="Are you sure you want to delete this contribution type?"
                              onConfirm={() => handleDelete(type.id.toString())}
                              disabled={isPending}
                              variant="destructive"
                              confirmText="Remove"
                              cancelText="Cancel"
                            >
                              <DropdownMenuItem
                                className="h-10 px-2 py-2 cursor-pointer"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <span className="font-body-text-s-regular text-red-700">
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
                  No records found matching your search "{search}"
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingType && (
        <EditContributionTypeDialog
          contributionType={editingType}
          open={!!editingType}
          onOpenChange={(open) => !open && setEditingType(null)}
        />
      )}

      {viewingType && (
        <ContributionTypeDetails
          contributionType={viewingType}
          open={!!viewingType}
          onOpenChange={(open) => !open && setViewingType(null)}
        />
      )}
    </section>
  )
})

ContributionTypesTable.displayName = 'ContributionTypesTable'
export default ContributionTypesTable
