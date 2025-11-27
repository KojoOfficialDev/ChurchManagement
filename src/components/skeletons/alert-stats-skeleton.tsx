import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function AlertStatsSkeleton() {
  return (
    <section className="flex items-end gap-[17px] w-full">
      <div className="grid grid-cols-3 gap-5 flex-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-[#cfd4dc] shadow-nones">
            <CardContent className="flex items-start gap-3 p-5">
              <Skeleton className="w-6 h-6" />
              <div className="flex flex-col gap-4 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-auto w-32 px-3 py-5 rounded-lg" />
    </section>
  )
}
