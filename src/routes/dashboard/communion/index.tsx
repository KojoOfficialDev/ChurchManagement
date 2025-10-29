import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import CommunionTable from '@/components/dashboard/communion/communion-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const Route = createFileRoute('/dashboard/communion/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <CommunionTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
