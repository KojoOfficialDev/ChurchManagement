import { Skeleton } from '@/components/ui/skeleton'

export const ChurchProfileFormSkeleton = () => {
  return (
    <div className="w-full max-w-lg bg-white rounded-lg p-8 space-y-4 mt-6">
      <Skeleton className="h-6 w-40" />
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-32 w-32 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  )
}
