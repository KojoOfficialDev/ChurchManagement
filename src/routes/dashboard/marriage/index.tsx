import MarriageTable from '@/components/dashboard/marriage/marriage-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/dashboard/marriage/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <ErrorBoundary level="section">
        <Suspense fallback={<TableSkeleton />}>
          <MarriageTable />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
