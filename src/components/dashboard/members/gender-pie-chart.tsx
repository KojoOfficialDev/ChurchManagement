import { Cell, Pie, PieChart } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'

export const description = 'A donut chart'

const chartConfig = {
  members: {
    label: 'Members',
  },
  males: {
    label: 'Males',
    color: 'var(--chart-1)',
  },
  females: {
    label: 'Females',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

interface GenderPieChartProps {
  genderCount: {
    male: number
    female: number
  }
}

export function GenderPieChart({ genderCount }: GenderPieChartProps) {
  const total = genderCount.male + genderCount.female

  const data = [
    {
      gender: 'Males',
      members: genderCount.male,
      percentage: total > 0 ? Math.round((genderCount.male / total) * 100) : 0,
      color: 'var(--chart-1)',
    },
    {
      gender: 'Females',
      members: genderCount.female,
      percentage:
        total > 0 ? Math.round((genderCount.female / total) * 100) : 0,
      color: 'var(--chart-2)',
    },
  ]

  return (
    <Card className="w-full border-0 shadow-none h-[140px] bg-transparent">
      <CardContent className="p-0 h-full flex items-center">
        <div className="flex items-center gap-8 w-full">
          <ChartContainer
            config={chartConfig}
            className="h-[140px] w-[140px] flex-shrink-0"
          >
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={0}
                dataKey="members"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-col gap-3">
            {data.map((item) => (
              <div key={item.gender} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-foreground capitalize">
                    {item.gender}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground ml-auto w-16 text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
