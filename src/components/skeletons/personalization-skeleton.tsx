import { Skeleton } from '@/components/ui/skeleton'

export function PersonalizationSkeleton() {
  return (
    <div className="space-y-6">
      {/* SMS Notification Toggle Card Skeleton */}
      <div className="border border-border rounded-lg p-5 max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full flex-shrink-0" />
        </div>
      </div>

      {/* Alert Checkboxes Skeleton */}
      <div className="space-y-4 pl-1">
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
          <Skeleton className="h-5 w-24" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
    </div>
  )
}
