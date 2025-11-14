import { CalendarIcon, UsersIcon } from 'lucide-react'
import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/card'
import { upcomingEventsQueryOptions } from '@/services/events/queries'

const colors = [
  'bg-orange-400',
  'bg-[#12b669]',
  'bg-rose-500',
  'bg-purple-500',
  'bg-blue-500',
]

export const UpcomingEventsSection = memo(() => {
  const { data: upcomingEvents } = useSuspenseQuery(
    upcomingEventsQueryOptions(),
  )

  return (
    <Card className="w-full bg-white rounded-2xl border border-solid border-[#cfd4dc] shadow-none">
      <CardContent className="flex flex-col items-start gap-4 p-6">
        <h2 className="self-stretch font-[number:var(--text-md-semibold-font-weight)] text-gray-800 text-[length:var(--text-md-semibold-font-size)] leading-[var(--text-md-semibold-line-height)] opacity-70 font-text-md-semibold tracking-[var(--text-md-semibold-letter-spacing)] [font-style:var(--text-md-semibold-font-style)]">
          Upcoming Events
        </h2>

        <div className="flex flex-col items-end gap-4 w-full">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <div
                key={event.id}
                className="flex items-center gap-3.5 px-3 py-2 w-full bg-white rounded-lg border border-solid border-[#eaecf0]"
              >
                <div
                  className={`w-2 h-[58px] rounded-md ${colors[index % colors.length]}`}
                />

                <div className="flex flex-col w-[309px] items-start justify-center gap-2.5">
                  <div className="w-fit font-[number:var(--text-md-semibold-font-weight)] text-gray-900 text-[length:var(--text-md-semibold-font-size)] text-center leading-[var(--text-md-semibold-line-height)] whitespace-nowrap opacity-70 font-text-md-semibold tracking-[var(--text-md-semibold-letter-spacing)] [font-style:var(--text-md-semibold-font-style)]">
                    {event.name}
                  </div>

                  <div className="flex items-center gap-[11px] w-full">
                    <div className="inline-flex items-center gap-[7px]">
                      <UsersIcon className="w-4 h-4" />

                      <div className="w-fit font-[number:var(--text-sm-medium-font-weight)] text-gray-600 text-[length:var(--text-sm-medium-font-size)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap opacity-70 font-text-sm-medium tracking-[var(--text-sm-medium-letter-spacing)] [font-style:var(--text-sm-medium-font-style)]">
                        {event.society?.name ?? 'General'}
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />

                      <div className="w-fit font-[number:var(--text-sm-medium-font-weight)] text-gray-600 text-[length:var(--text-sm-medium-font-size)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap opacity-70 font-text-sm-medium tracking-[var(--text-sm-medium-letter-spacing)] [font-style:var(--text-sm-medium-font-style)]">
                        {format(event.eventDate, 'MMMM do, yyyy')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500 text-sm">
              No upcoming events scheduled
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
})

UpcomingEventsSection.displayName = 'UpcomingEventsSection'
export default UpcomingEventsSection
