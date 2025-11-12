import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Create varied but consistent heights for visual interest
const barHeights = [45, 60, 35, 70, 50, 40, 65, 55, 45, 50, 60, 55]

export function OverviewChartSkeleton() {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-2">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-40" />
          </CardDescription>
        </div>
        <Skeleton className="h-9 w-20" />
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] w-full space-y-4">
          {/* Chart area skeleton */}
          <div className="flex h-[300px] items-end justify-between gap-2">
            {Array.from({ length: 12 }).map((_, index) => {
              const height1 = `h-[${barHeights[index]}]`
              const height2 = `h-[${barHeights[index] * 0.7}%]`
              return (
                <div
                  key={index}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="flex w-full flex-col items-center justify-end gap-1">
                    <Skeleton className={cn('w-full rounded-t-md', height1)} />
                    <Skeleton className={cn('w-full rounded-t-md', height2)} />
                  </div>
                  <Skeleton className="h-4 w-8" />
                </div>
              )
            })}
          </div>
          {/* Legend skeleton */}
          <div className="flex items-center justify-center gap-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
