import {
  DownloadIcon,
  MoreVerticalIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import { Suspense, memo, useCallback, useMemo, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import AddExpenseDialog from './add-expense-dialog'
import EditExpenseDialog from './edit-expense-dialog'
import ExpenseDetails from './expense-details'
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
import { expensesQueryOptions } from '@/services/expenses/expenses-queries'
import { Pagination } from '@/components/ui/pagination'
import { EmptyComponent } from '@/components/empty-component'
import { ErrorBoundary } from '@/components/error-boundary'
import { ButtonSkeleton } from '@/components/skeletons/button-skeleton'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { formatCurrency } from '@/lib/utils'
import { useExcelExport } from '@/lib/hooks/use-excel-export'
import { ExpenseService } from '@/services/expenses/expenses.service'

const ExpensesTable = memo(() => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)
  const { data: expensesData } = useSuspenseQuery(
    expensesQueryOptions({ page, pageSize, search: debouncedSearch }),
  )
  const { isOpen } = useSidebar()
  const [selectedExpenses, setSelectedExpenses] = useState<Array<string>>([])
  const [editingExpense, setEditingExpense] = useState<any>(null)
  const [viewingExpense, setViewingExpense] = useState<any>(null)

  const expenses = useMemo(() => expensesData.data, [expensesData])

  const { exportToExcel, isExporting } = useExcelExport({
    fetchData: ExpenseService.getAllExpenses,
    columns: [
      { header: 'ID', accessor: (item: any) => item.id },
      { header: 'Name', accessor: (item: any) => item.name },
      {
        header: 'Description',
        accessor: (item: any) => item.description || '-',
      },
      {
        header: 'Expense Category ID',
        accessor: (item: any) => item.expensesCategoryId || '-',
      },
      {
        header: 'Amount Spent',
        accessor: (item: any) => item.amountSpent,
      },
      {
        header: 'Amount Spent (Formatted)',
        accessor: (item: any) => formatCurrency(item.amountSpent),
      },
      {
        header: 'Supplier',
        accessor: (item: any) => item.suppliersName || '-',
      },
      { header: 'Payment Method', accessor: (item: any) => item.paymentMethod },
      {
        header: 'Expense Date',
        accessor: (item: any) => format(item.expenseDate, 'MMM dd, yyyy'),
      },
      {
        header: 'Is Active',
        accessor: (item: any) => (item.isActive ? 'Yes' : 'No'),
      },
    ],
    filename: 'expenses',
  })

  const toggleSelect = useCallback(
    (id: string) => {
      if (selectedExpenses.includes(id)) {
        setSelectedExpenses((prev) =>
          prev.filter((selectedId) => selectedId !== id),
        )
      } else {
        setSelectedExpenses((prev) => [...prev, id])
      }
    },
    [selectedExpenses],
  )

  const handleSelectAll = useCallback(() => {
    setSelectedExpenses(expenses.map((expense) => expense.id.toString()))
  }, [expenses])

  const handleDeselectAll = useCallback(() => {
    setSelectedExpenses([])
  }, [])

  const isAllSelected = useMemo(
    () => selectedExpenses.length === expenses.length,
    [selectedExpenses, expenses.length],
  )

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      handleDeselectAll()
    } else {
      handleSelectAll()
    }
  }, [isAllSelected, handleDeselectAll, handleSelectAll])

  if (expenses.length === 0 && !debouncedSearch) {
    return (
      <EmptyComponent
        title="No expenses found"
        description="Create an expense to get started"
        buttonText="Add Expense"
        buttonOnClick={
          <ErrorBoundary level="component">
            <Suspense fallback={<ButtonSkeleton />}>
              <AddExpenseDialog />
            </Suspense>
          </ErrorBoundary>
        }
        media={
          <img
            src="/image-3.svg"
            alt="No expenses found"
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
          Expenses
        </h2>
        <AddExpenseDialog />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <h3 className="text-gray-600 font-bold text-xl">All Expenses</h3>

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

                {selectedExpenses.length > 1 && (
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
            {expenses.length > 0 ? (
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
                        Amount Spent
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Supplier
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Payment Method
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">
                      <span className="font-medium text-gray-800 text-xs">
                        Expense Date
                      </span>
                    </TableHead>
                    <TableHead className="px-6 py-3">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow
                      key={expense.id}
                      className="border-b border-[#eaecf0]"
                    >
                      <TableCell className="px-6 py-3">
                        <Checkbox
                          checked={selectedExpenses.includes(
                            expense.id.toString(),
                          )}
                          onCheckedChange={() =>
                            toggleSelect(expense.id.toString())
                          }
                          className="cursor-pointer"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {expense.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {formatCurrency(expense.amountSpent)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {expense.suppliersName || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {expense.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-3">
                        <span className="font-normal text-gray-800 text-xs">
                          {format(expense.expenseDate, 'MMM dd, yyyy')}
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
                              className="h-10 px-2 py-2  rounded-lg cursor-pointer"
                              onClick={() => setViewingExpense(expense)}
                            >
                              <span className="font-body-text-s-regular">
                                View Details
                              </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="h-10 px-2 py-2 rounded-lg cursor-pointer"
                              onClick={() => setEditingExpense(expense)}
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
        <Pagination
          currentPage={expensesData.page}
          pageSize={expensesData.pageSize}
          totalCount={expensesData.totalCount}
          totalPages={expensesData.totalPages}
          hasPrevious={expensesData.hasPrevious}
          hasNext={expensesData.hasNext}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
        />
      )}

      {viewingExpense && (
        <ExpenseDetails
          expense={viewingExpense}
          open={!!viewingExpense}
          onOpenChange={(open) => !open && setViewingExpense(null)}
        />
      )}
    </section>
  )
})

ExpensesTable.displayName = 'ExpensesTable'
export default ExpensesTable
