import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
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
import AddContributionTypeDialog from './add-contribution-type-dialog'
import { Badge } from '@/components/ui/badge'

const ContributionTypesTable = memo(() => {
  const [search, setSearch] = useState('')
  const { data: contributionTypesData = [] } = useSuspenseQuery(
    contributionTypesQueryOptions(),
  )
  const { isOpen } = useSidebar()
  const [selectedTypes, setSelectedTypes] = useState<Array<string>>([])

  const contributionTypes = useMemo(() => {
    if (!search) return contributionTypesData
    return contributionTypesData.filter(
      (type) =>
        type.name.toLowerCase().includes(search.toLowerCase()) ||
        type.paymentType.toLowerCase().includes(search.toLowerCase()),
    )
  }, [contributionTypesData, search])

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

  if (contributionTypes.length === 0 && !search) {
    return (
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
        media={
          <img
            src="/image-3.svg"
            alt="No contribution types found"
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

              <Button variant="outline" size={isOpen ? 'icon' : 'default'}>
                <DownloadIcon className="w-5 h-5" />
                {!isOpen && <span className="font-medium text-sm">Export</span>}
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
                        <Badge variant={type.active ? 'default' : 'secondary'}>
                          {type.active ? 'Active' : 'Inactive'}
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
                            <DropdownMenuItem className="h-10 px-2 py-2 bg-gray-100 rounded-lg cursor-pointer">
                              <span className="font-body-text-s-regular">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-10 px-2 py-2 rounded-lg cursor-pointer">
                              <span className="font-body-text-s-regular">
                                Edit
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="h-10 px-2 py-2 cursor-pointer">
                              <span className="font-body-text-s-regular text-red-700">
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
                  No records found matching your search "{search}"
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
})

ContributionTypesTable.displayName = 'ContributionTypesTable'
export default ContributionTypesTable
