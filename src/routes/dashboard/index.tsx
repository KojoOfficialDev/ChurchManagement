import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { OverviewChart } from '@/components/dashboard/overview/overview-chart'
import OverviewStatCards from '@/components/dashboard/overview/overview-stat-cards'
import UpcomingEventsSection from '@/components/dashboard/overview/upcoming-events'
import { OverviewChartSkeleton } from '@/components/skeletons/overview-chart-skeleton'
import { OverviewStatCardsSkeleton } from '@/components/skeletons/overview-stat-cards-skeleton'
import { dashboardStatCountsQuery } from '@/services/analytics/queries'
import { ErrorBoundary } from '@/components/error-boundary'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dashboardStatCountsQuery),
})

function RouteComponent() {
  return (
    <ErrorBoundary level="page">
      <div className="space-y-8">
        <Suspense fallback={<OverviewStatCardsSkeleton />}>
          <OverviewStatCards />
        </Suspense>
        <Suspense fallback={<OverviewChartSkeleton />}>
          <OverviewChart />
        </Suspense>
        <UpcomingEventsSection />
      </div>
    </ErrorBoundary>
  )
}
