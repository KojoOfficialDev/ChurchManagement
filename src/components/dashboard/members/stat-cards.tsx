import { TrendingUpIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { memo } from 'react'

const membershipData = [
  {
    title: 'Total Membership',
    value: '4,000',
    trend: '8.5%',
    trendText: 'Up last Month',
    bgColor: 'bg-[#4a1fb7]',
    textColor: 'text-white',
    titleOpacity: 'opacity-70',
  },
  {
    title: 'Active Members',
    value: '3400',
    trend: '8.5%',
    trendText: 'Up last Month',
    bgColor: 'bg-white',
    textColor: 'text-gray-800',
    titleOpacity: 'opacity-70',
  },
]

const MembersStatsCards = memo(() => {
  return (
    <section className="flex items-center gap-5">
      {membershipData.map((item, index) => (
        <Card
          key={index}
          className={`${item.bgColor} rounded-xl p-0 border ${
            item.bgColor === 'bg-white' ? 'border-[#cfd4dc]' : 'border-none'
          } w-[264px]`}
        >
          <CardContent className="flex flex-col gap-[29px] p-5">
            <div className="flex items-center gap-5">
              <div className="flex flex-col gap-4 w-[120px]">
                <div
                  className={`${item.titleOpacity} font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] ${item.textColor} text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)] whitespace-nowrap`}
                >
                  {item.title}
                </div>

                <div
                  className={`${item.textColor} font-display-xs-bold font-[number:var(--display-xs-bold-font-weight)] text-[length:var(--display-xs-bold-font-size)] tracking-[var(--display-xs-bold-letter-spacing)] leading-[var(--display-xs-bold-line-height)] [font-style:var(--display-xs-bold-font-style)]`}
                >
                  {item.value}
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2">
              <TrendingUpIcon className="w-6 h-6 text-[#12b669]" />

              <div className="[font-family:'Inter',Helvetica] font-normal text-transparent text-base tracking-[0] leading-4">
                <span className="font-medium text-[#12b669] leading-6">
                  {item.trend}
                </span>
                <span className="font-medium text-[#12153c] leading-6"> </span>
                <span
                  className={`font-medium leading-6 ${
                    item.bgColor === 'bg-white'
                      ? 'text-[#475466]'
                      : 'text-[#ffffff]'
                  }`}
                >
                  {item.trendText}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
})

MembersStatsCards.displayName = 'MembersStatsCards'
export default MembersStatsCards
