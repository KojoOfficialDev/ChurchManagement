import { Suspense } from 'react'
import { AlertStats } from './alert-stats'
import { AlertTemplates } from './alert-templates'
import AlertLogTable from './alert-log-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'

export const AlertCenter = () => {
  return (
    <main className="w-full space-y-10">
      <section className="w-full">
        <AlertStats />
      </section>
      <section className="w-full ">
        <AlertTemplates />
      </section>
      <section className="w-full">
        <ErrorBoundary level="component">
          <Suspense fallback={<TableSkeleton />}>
            <AlertLogTable />
          </Suspense>
        </ErrorBoundary>
      </section>
    </main>
  )
}
