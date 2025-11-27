import { Suspense } from 'react'
import { AlertStats } from './alert-stats'
import { AlertTemplates } from './alert-templates'
import AlertLogTable from './alert-log-table'
import { ErrorBoundary } from '@/components/error-boundary'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import { AlertStatsSkeleton } from '@/components/skeletons/alert-stats-skeleton'
import { AlertTemplatesSkeleton } from '@/components/skeletons/alert-templates-skeleton'

export const AlertCenter = () => {
  return (
    <main className="w-full space-y-10">
      <section className="w-full">
        <Suspense fallback={<AlertStatsSkeleton />}>
          <ErrorBoundary level="component">
            <AlertStats />
          </ErrorBoundary>
        </Suspense>
      </section>
      <section className="w-full ">
        <Suspense fallback={<AlertTemplatesSkeleton />}>
          <ErrorBoundary level="component">
            <AlertTemplates />
          </ErrorBoundary>
        </Suspense>
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
