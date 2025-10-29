import { TrendingUp } from 'lucide-react'
import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const statsData = [
  {
    title: 'Total Membership',
    value: '4,000',
    percentage: '8.5%',
    trend: 'Up last Month',
    icon: TrendingUp,
  },
  {
    title: 'Active Members',
    value: '4,000',
    percentage: '8.5%',
    trend: 'Up last Month',
    icon: TrendingUp,
  },
  {
    title: 'Total Expense',
    value: 'GHS 44,000',
    percentage: '8.5%',
    trend: 'Up last Month',
    icon: TrendingUp,
  },
  {
    title: 'Total Contribution',
    value: 'GHS 64,000',
    percentage: '8.5%',
    trend: 'Up last Month',
    icon: TrendingUp,
  },
]

const OverviewStatCards = memo(() => {
  return (
    <section className="flex items-center gap-5 w-full">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex-1 bg-white rounded-xl border border-solid border-[#cfd4dc] shadow-none"
        >
          <CardContent className="flex flex-col gap-[29px] p-5">
            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col items-start gap-4">
                <div className="opacity-70 font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-800 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
                  {stat.title}
                </div>
                <div className="font-display-xs-bold font-[number:var(--display-xs-bold-font-weight)] text-gray-800 text-[length:var(--display-xs-bold-font-size)] tracking-[var(--display-xs-bold-letter-spacing)] leading-[var(--display-xs-bold-line-height)] [font-style:var(--display-xs-bold-font-style)]">
                  {stat.value}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <stat.icon className="w-6 h-6 text-green-500" />
              <div className="[font-family:'Inter',Helvetica] font-normal text-transparent text-base tracking-[0] leading-4">
                <span className="font-medium text-green-500 leading-6">
                  {stat.percentage}
                </span>
                <span className="font-medium text-gray-800 leading-6">
                  &nbsp;
                </span>
                <span className="font-medium text-gray-800 leading-6">
                  {stat.trend}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
})

OverviewStatCards.displayName = 'OverviewStatCards'
export default OverviewStatCards
