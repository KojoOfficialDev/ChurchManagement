import { CalendarIcon, UsersIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const eventsData = [
  {
    title: 'Annual  Prayer Converence',
    department: 'Youth department',
    date: 'October 20th, 2025',
  },
  {
    title: 'Community Outreach Program',
    department: 'Social Services',
    date: 'June 15th, 2026',
  },
  {
    title: 'Thanksgiving Celebration',
    department: 'Family Ministry',
    date: 'November 24th, 2025',
  },
]

export const EventDetailsSection = () => {
  return (
    <Card className="w-full bg-white rounded-2xl border border-[#eaecf0]">
      <CardContent className="flex flex-col items-start gap-[17px] p-6">
        <h2 className="self-stretch font-[number:var(--text-md-semibold-font-weight)] text-gray-800 text-[length:var(--text-md-semibold-font-size)] leading-[var(--text-md-semibold-line-height)] opacity-70 font-text-md-semibold tracking-[var(--text-md-semibold-letter-spacing)] [font-style:var(--text-md-semibold-font-style)]">
          Upcoming Events
        </h2>

        <div className="flex flex-col items-end gap-4 w-full">
          {eventsData.map((event, index) => (
            <div
              key={index}
              className="flex items-center gap-3.5 px-3 py-2 w-full bg-white rounded-lg border border-solid border-[#eaecf0]"
            >
              <div className="w-2 h-[58px] bg-orange-400 rounded-md flex-shrink-0" />

              <div className="flex flex-col flex-1 items-start justify-center gap-2.5">
                <div className="opacity-70 font-text-md-semibold font-[number:var(--text-md-semibold-font-weight)] text-gray-900 text-[length:var(--text-md-semibold-font-size)] text-center tracking-[var(--text-md-semibold-letter-spacing)] leading-[var(--text-md-semibold-line-height)] whitespace-nowrap [font-style:var(--text-md-semibold-font-style)]">
                  {event.title}
                </div>

                <div className="flex items-center gap-[11px] w-full">
                  <div className="inline-flex items-center gap-[7px]">
                    <UsersIcon className="w-4 h-4 text-gray-600" />
                    <div className="font-[number:var(--text-sm-medium-font-weight)] text-gray-600 text-[length:var(--text-sm-medium-font-size)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap opacity-70 font-text-sm-medium tracking-[var(--text-sm-medium-letter-spacing)] [font-style:var(--text-sm-medium-font-style)]">
                      {event.department}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4 text-gray-600" />
                    <div className="font-[number:var(--text-sm-medium-font-weight)] text-gray-600 text-[length:var(--text-sm-medium-font-size)] leading-[var(--text-sm-medium-line-height)] whitespace-nowrap opacity-70 font-text-sm-medium tracking-[var(--text-sm-medium-letter-spacing)] [font-style:var(--text-sm-medium-font-style)]">
                      {event.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
