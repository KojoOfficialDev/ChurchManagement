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
        <h1 className="text-gray-800 font-text-xl-bold font-[number:var(--text-xl-bold-font-weight)] text-[length:var(--text-xl-bold-font-size)] tracking-[var(--text-xl-bold-letter-spacing)] leading-[var(--text-xl-bold-line-height)] [font-style:var(--text-xl-bold-font-style)]">
          Contributions
        </h1>
      </header>

      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ContributionsTable />
        </Suspense>
      </ErrorBoundary>
      {/* Contribution Types Section */}
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton length={5} />}>
          <ContributionTypesTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
