import { Skeleton } from '@/components/ui/skeleton'

export const TableSkeleton = ({ length = 10 }: { length?: number }) => {
  return (
    <section className="flex flex-col w-full items-start gap-6">
      {/* Header skeleton */}
      <header className="flex items-center justify-between w-full gap-10">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-32" />
      </header>

      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex flex-col items-start w-full bg-[#ffffff] rounded-2xl overflow-hidden border border-solid border-[#eaecf0]">
          {/* Table header skeleton */}
          <div className="flex items-center justify-between w-full bg-[#ffffff] border-b border-solid border-[#eaecf0] pt-5 pb-[19px] px-6">
            <Skeleton className="h-6 w-24" />

            <div className="flex items-center gap-4">
              <div className="flex items-start gap-2">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-[170px]" />
                <Skeleton className="h-10 w-[170px]" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Table skeleton */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-full">
              {/* Table header row */}
              <div className="bg-[#fbfcfc] border-b border-[#eaecf0] flex">
                <div className="w-[75px] px-6 py-3">
                  <Skeleton className="h-4 w-4" />
                </div>
                <div className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="w-[58px] px-6 py-3">
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>

              {/* Table body rows */}
              {Array.from({ length }).map((_, index) => (
                <div key={index} className="border-b border-[#eaecf0] flex">
                  <div className="w-[75px] px-6 py-3">
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="px-6 py-3 flex-1">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="w-[58px] px-6 py-3">
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="w-full bg-[#ffffff] rounded-lg shadow-[0px_1px_11.7px_1px_#b9b9b914] px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-4 w-24" />

            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-8" />

              <div className="flex items-start gap-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="w-[30px] h-7" />
                ))}
              </div>

              <Skeleton className="h-8 w-8" />
            </div>

            <div className="flex items-center gap-1.5">
              <Skeleton className="w-[51px] h-7" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
