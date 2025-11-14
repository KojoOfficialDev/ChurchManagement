import { Suspense } from 'react'
import UpcomingEventsSection from '@/components/dashboard/overview/upcoming-events'
import { CalendarSection } from '@/components/dashboard/events/calendar-section'
import { EventsListSection } from '@/components/dashboard/events/events-table'
import { Card, CardContent } from '@/components/ui/card'

const UpcomingEventsLoading = () => (
  <Card className="w-full bg-white rounded-2xl border border-solid border-[#cfd4dc] shadow-none">
    <CardContent className="flex flex-col items-start gap-4 p-6">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      <div className="flex flex-col items-end gap-4 w-full">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 px-3 py-2 w-full bg-gray-100 rounded-lg h-[74px] animate-pulse"
          />
        ))}
      </div>
    </CardContent>
  </Card>
)

const EventsTableLoading = () => (
  <Card className="w-full bg-white rounded-2xl border border-[#eaecf0]">
    <CardContent className="p-6">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </CardContent>
  </Card>
)

export const Events = () => {
  return (
    <main className="flex-1 flex flex-col">
      <section className="w-full grid grid-cols-5 gap-10 p-4">
        <div className="col-span-2">
          <CalendarSection />
        </div>
        <div className="col-span-3">
          <Suspense fallback={<UpcomingEventsLoading />}>
            <UpcomingEventsSection />
          </Suspense>
        </div>
      </section>
      <section className="w-full flex-1">
        <Suspense fallback={<EventsTableLoading />}>
          <EventsListSection />
        </Suspense>
      </section>
    </main>
  )
}
