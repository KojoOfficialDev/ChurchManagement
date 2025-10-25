import MembersTable from '@/components/dashboard/members/members-table'
import MembersStatsCards from '@/components/dashboard/members/stat-cards'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { memo, Suspense } from 'react'

export const Route = createFileRoute('/dashboard/members/')({
  component: memo(RouteComponent),
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <MembersStatsCards />
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <MembersTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
