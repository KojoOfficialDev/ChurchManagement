import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ContributionTypesTable from '@/components/dashboard/contributions/contribution-types/contribution-types-table'
import ContributionsTable from '@/components/dashboard/contributions/contributions/contributions-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const Route = createFileRoute('/dashboard/contribution/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h1 className="text-gray-900 font-text-2xl-bold font-[number:var(--text-2xl-bold-font-weight)] text-[length:var(--text-2xl-bold-font-size)] tracking-[var(--text-2xl-bold-letter-spacing)] leading-[var(--text-2xl-bold-line-height)] [font-style:var(--text-2xl-bold-font-style)]">
          Contributions Management
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage contribution types and record contributions
        </p>
      </header>

      {/* Contribution Types Section */}
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ContributionTypesTable />
        </Suspense>
      </ErrorBoundary>

      {/* Contributions Section */}
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ContributionsTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

