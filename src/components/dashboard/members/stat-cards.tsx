import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { GenderPieChart } from './gender-pie-chart'
import { Card, CardContent } from '@/components/ui/card'
import { getMemberStatisticsOptions } from '@/services/members/queries'

const MembersStatsCards = memo(() => {
  const { data } = useSuspenseQuery(getMemberStatisticsOptions)

  const membershipData = [
    {
      title: 'Total Membership',
      value: data.totalMembers.toLocaleString(),
      bgColor: 'bg-[#4a1fb7]',
      textColor: 'text-white',
      titleOpacity: 'opacity-70',
    },
    {
      title: 'Active Members',
      value: data.activeMembers.toLocaleString(),
      bgColor: 'bg-white',
      textColor: 'text-gray-800',
      titleOpacity: 'opacity-70',
    },
  ]

  return (
    <section className="grid grid-cols-3 gap-5">
      {membershipData.map((item, index) => (
        <Card
          key={index}
          className={`${item.bgColor} rounded-xl p-0 border ${
            item.bgColor === 'bg-white' ? 'border-[#cfd4dc]' : 'border-none'
          } h-[140px]`}
        >
          <CardContent className="flex flex-col gap-[29px] p-5 h-full justify-center">
            <div className="flex items-center gap-5">
              <div className="flex flex-col gap-4">
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
          </CardContent>
        </Card>
      ))}
      <div>
        <GenderPieChart genderCount={data.genderCount} />
      </div>
    </section>
  )
})

MembersStatsCards.displayName = 'MembersStatsCards'
export default MembersStatsCards
