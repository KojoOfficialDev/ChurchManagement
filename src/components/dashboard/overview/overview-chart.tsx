import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import type {ChartConfig} from '@/components/ui/chart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartData = [
  { month: 'January', amount: 186 },
  { month: 'February', amount: 305 },
  { month: 'March', amount: 237 },
  { month: 'April', amount: 73 },
  { month: 'May', amount: 209 },
  { month: 'June', amount: 214 },
]

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function OverviewChart() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Contribution Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="amount"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
