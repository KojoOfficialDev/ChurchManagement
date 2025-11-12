import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ExpenseCategoriesTable from '@/components/dashboard/expenses/expense-categories/expense-categories-table'
import ExpensesTable from '@/components/dashboard/expenses/expenses/expenses-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const Route = createFileRoute('/dashboard/expenses/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Expenses
        </h1>
      </header>

      {/* Expenses Section */}
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ExpensesTable />
        </Suspense>
      </ErrorBoundary>
      {/* Expense Categories Section */}
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ExpenseCategoriesTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
