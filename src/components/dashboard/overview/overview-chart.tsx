import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChevronDownIcon } from 'lucide-react'

import { useSuspenseQuery } from '@tanstack/react-query'
import type { ChartConfig } from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { monthlyContributionsDataQuery } from '@/services/analytics/queries'

const chartConfig = {
  contribution: {
    label: 'contribution',
    color: 'var(--chart-1)',
  },
  expense: {
    label: 'expense',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

// Generate years array: current year and last 5 years
const getYears = () => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, i) => currentYear - i)
}

export function OverviewChart() {
  const years = getYears()
  const [selectedYear, setSelectedYear] = useState(years[0])
  const { data: chartData } = useSuspenseQuery(
    monthlyContributionsDataQuery({ year: selectedYear }),
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Contributions & Expenses</CardTitle>
          <CardDescription>Monthly overview for {selectedYear}</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {selectedYear}
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {years.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
                className={selectedYear === year ? 'bg-accent' : ''}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="contribution"
              fill="var(--color-contribution)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
