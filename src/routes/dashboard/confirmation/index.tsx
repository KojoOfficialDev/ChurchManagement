import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import ConfirmationTable from '@/components/dashboard/confirmation/confirmation-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const Route = createFileRoute('/dashboard/confirmation/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <ConfirmationTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
