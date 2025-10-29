import { createFileRoute } from '@tanstack/react-router'
import { OverviewChart } from '@/components/dashboard/overview/overview-chart'
import OverviewStatCards from '@/components/dashboard/overview/overview-stat-cards'
import UpcomingEventsSection from '@/components/dashboard/overview/upcoming-events'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='space-y-8'>
      <OverviewStatCards />
      <OverviewChart />
      <UpcomingEventsSection />
    </div>
  )
}
