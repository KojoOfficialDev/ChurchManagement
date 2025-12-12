import { ArrowRight, TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { memo } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { dashboardStatCountsQuery } from '@/services/analytics/queries'

const OverviewStatCards = memo(() => {
  const { data } = useSuspenseQuery(dashboardStatCountsQuery)

  return (
    <section className="flex items-center gap-5 w-full">
      {data.map((stat, index) => (
        <Card
          key={index}
          className="flex-1 bg-white rounded-xl border border-solid border-[#cfd4dc] shadow-none"
        >
          <CardContent className="flex flex-col gap-[29px] p-5">
            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col items-start gap-4">
                <div className="opacity-70 font-text-sm-medium font-[number:var(--text-sm-medium-font-weight)] text-gray-800 text-[length:var(--text-sm-medium-font-size)] tracking-[var(--text-sm-medium-letter-spacing)] leading-[var(--text-sm-medium-line-height)] [font-style:var(--text-sm-medium-font-style)]">
                  {stat.name}
                </div>
                <div className="font-display-xs-bold font-[number:var(--display-xs-bold-font-weight)] text-gray-800 text-[length:var(--display-xs-bold-font-size)] tracking-[var(--display-xs-bold-letter-spacing)] leading-[var(--display-xs-bold-line-height)] [font-style:var(--display-xs-bold-font-style)]">
                  {stat.total}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 whitespace-nowrap">
              {getTrendIcon(stat.trend)}
              <div className=" font-normal text-transparent tracking-[0] leading-4 text-sm">
                <span className="font-medium text-green-500 leading-6">
                  {stat.trend === 'up'
                    ? `+${stat.totalChangePct}%`
                    : `${stat.totalChangePct}%`}
                </span>
                <span className="font-medium text-gray-800 leading-6">
                  &nbsp;
                </span>
                <span className="font-medium text-gray-800 leading-6 whitespace-nowrap">
                  {stat.trend === 'up'
                    ? 'Up last Month'
                    : stat.trend === 'down'
                      ? 'Down last Month'
                      : 'No change'}
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

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUpIcon className="w-6 h-6 text-green-500" />
    case 'down':
      return <TrendingDownIcon className="w-6 h-6 text-red-500" />
    default:
      return <ArrowRight className="w-6 h-6 text-gray-500" />
  }
}
