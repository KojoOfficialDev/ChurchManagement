import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import BaptismTable from '@/components/dashboard/baptism/baptism.table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const Route = createFileRoute('/dashboard/baptism/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <BaptismTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
