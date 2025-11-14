import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import AddExpenseCategoryDialog from './add-expense-category-dialog'
import EditExpenseCategoryDialog from './edit-expense-category-dialog'
import ExpenseCategoryDetails from './expense-category-details'
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
import { expenseCategoriesQueryOptions } from '@/services/expenses/expense-categories-queries'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { Badge } from '@/components/ui/badge'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { ExpenseCategoryService } from '@/services/expenses/expense-categories.service'

const ExpenseCategoriesTable = memo(() => {
  const [search, setSearch] = useState('')
  const { data: expenseCategoriesData = [] } = useSuspenseQuery(
    expenseCategoriesQueryOptions(),
  )
  const { isOpen } = useSidebar()
  const [selectedCategories, setSelectedCategories] = useState<Array<string>>(
    [],
  )
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [viewingCategory, setViewingCategory] = useState<any>(null)

  const expenseCategories = useMemo(() => {
    if (!search) return expenseCategoriesData
    return expenseCategoriesData.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [expenseCategoriesData, search])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: ExpenseCategoryService.getAllExpenseCategories,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      { header: 'Name', accessor: (item: any) => item.name },
      {
        header: 'Is Active',
        accessor: (item: any) => (item.isActive ? 'Yes' : 'No'),
      },
      {
        header: 'Active',
        accessor: (item: any) => (item.active ? 'Yes' : 'No'),
      },
    ],
    filename: 'expense-categories',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedCategories.includes(id)) {
        setSelectedCategories((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedCategories((prev) => [...prev, id])
      }
    },
    [selectedCategories],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedCategories(
      expenseCategories.map((category) => category.id.toString()),
    )
  }, [expenseCategories])

  const handleDeselectAll = useCallback(() => {
    setSelectedCategories([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedCategories.length === expenseCategories.length,
    [selectedCategories, expenseCategories.length],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  if (expenseCategories.length === 0 && !search) {
    return (
      <div className="border-t">
        <EmptyComponent
          title="No expense categories found"
          description="Create an expense category to get started"
          buttonText="Add Expense Category"
          buttonOnClick={
            <ErrorBoundary level="component">
              <Suspense fallback={<ButtonSkeleton />}>
                <AddExpenseCategoryDialog />
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
          Expense Categories
        </h2>
        <AddExpenseCategoryDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h3 className="text-gray-600 font-bold text-xl">
              All Expense Categories
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

                {selectedCategories.length > 1 && (
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
            {expenseCategories.length > 0 ? (
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
                        Active Status
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedCategories.includes(
                            category.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(category.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {category.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <Badge
                          variant={category.active ? 'default' : 'secondary'}
                        >
                          {category.active ? 'Active' : 'Inactive'}
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
                              onClick={() => setViewingCategory(category)}
                            >
                              <span className="font-body-text-s-regular">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingCategory(category)}
                            >
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

      {editingCategory && (
        <EditExpenseCategoryDialog
          category={editingCategory}
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
        />
      )}

      {viewingCategory && (
        <ExpenseCategoryDetails
          category={viewingCategory}
          open={!!viewingCategory}
          onOpenChange={(open) => !open && setViewingCategory(null)}
        />
      )}
    </section>
  )
})

ExpenseCategoriesTable.displayName = 'ExpenseCategoriesTable'
export default ExpenseCategoriesTable
