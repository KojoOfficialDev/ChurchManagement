import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function AlertTemplatesSkeleton() {
  return (
    <section className="flex flex-col w-full items-start gap-6 relative">
      <header className="flex items-center justify-between w-full">
        <Skeleton className="h-7 w-32" />

        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-24 rounded-lg" />
          <Skeleton className="h-11 w-28 rounded-lg" />
        </div>
      </header>

      <div className="flex flex-col items-start gap-3 w-full">
        <Skeleton className="h-5 w-24" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              key={index}
              className="bg-[#fff6e9] border-[#ffd79f] rounded-lg"
            >
              <CardContent className="flex flex-col gap-3 p-3">
                <Skeleton className="h-6 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}

          <Skeleton className="w-[50px] h-[50px] rounded-lg" />
        </div>
      </div>
    </section>
  )
}
