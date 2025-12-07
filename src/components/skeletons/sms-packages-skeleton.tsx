import { Skeleton } from '@/components/ui/skeleton'

export function SMSPackagesSkeleton() {
  return (
    <div className="space-y-4 mt-8">
      <div>
        <Skeleton className="h-7 w-44 mb-2" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-lg p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
