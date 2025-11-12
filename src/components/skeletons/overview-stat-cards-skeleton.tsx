import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function OverviewStatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="flex items-center gap-5 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="flex-1 bg-white rounded-xl border-0 shadow-none"
        >
          <CardContent className="flex flex-col gap-[29px] p-5">
            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col items-start gap-4 w-full">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <div className="inline-flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
