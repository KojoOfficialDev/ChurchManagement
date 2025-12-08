import { createFileRoute } from '@tanstack/react-router'
import { Suspense, memo } from 'react'
import MembersTable from '@/components/dashboard/members/members-table'
import MembersStatsCards from '@/components/dashboard/members/stat-cards'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import { OverviewStatCardsSkeleton } from '@/components/skeletons/overview-stat-cards-skeleton'

export const Route = createFileRoute('/dashboard/members/')({
  component: memo(RouteComponent),
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <ErrorBoundary level="section">
        <Suspense fallback={<OverviewStatCardsSkeleton />}>
          <MembersStatsCards />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <MembersTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
