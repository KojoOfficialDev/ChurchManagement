import { Suspense } from 'react'
import SocietiesTable from './societies-table'
import CountriesTable from './countries-table'
import { TableSkeleton } from '@/components/skeletons/table.skeleton'
import { ErrorBoundary } from '@/components/error-boundary'

type RenderSetupSectionProps = {
  tab: 'countries' | 'societies'
}
export const RenderSetupSection = ({ tab }: RenderSetupSectionProps) => {
  switch (tab) {
    case 'countries':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<TableSkeleton />}>
            <CountriesTable />
          </Suspense>
        </ErrorBoundary>
      )
    case 'societies':
      return (
        <ErrorBoundary level="section">
          <Suspense fallback={<TableSkeleton />}>
            <SocietiesTable />
          </Suspense>
        </ErrorBoundary>
      )
  }
}
