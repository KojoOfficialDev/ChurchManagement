import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useCallback, useMemo, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface PaginationProps {
  currentPage: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: Array<number>
  maxPageButtons?: number
}

export const Pagination = ({
  currentPage,
  pageSize,
  totalCount,
  totalPages,
  hasPrevious,
  hasNext,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [15, 25, 50],
  maxPageButtons = 5,
}: PaginationProps) => {
  const [_isPending, startTransition] = useTransition()
  // Calculate the range of items being displayed
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  // Generate page numbers with smart ellipsis
  const pageNumbers = useMemo(() => {
    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than max
      return Array.from({ length: totalPages }, (_, i) => ({
        number: i + 1,
        active: i + 1 === currentPage,
        isEllipsis: false,
      }))
    }

    const pages: Array<{
      number: number
      active: boolean
      isEllipsis: boolean
    }> = []
    const halfWindow = Math.floor(maxPageButtons / 2)

    // Always show first page
    pages.push({
      number: 1,
      active: currentPage === 1,
      isEllipsis: false,
    })

    // Determine start and end of the middle section
    let startPage = Math.max(2, currentPage - halfWindow)
    let endPage = Math.min(totalPages - 1, currentPage + halfWindow)

    // Adjust if we're near the beginning
    if (currentPage <= halfWindow + 1) {
      endPage = Math.min(maxPageButtons - 1, totalPages - 1)
    }

    // Adjust if we're near the end
    if (currentPage >= totalPages - halfWindow) {
      startPage = Math.max(2, totalPages - maxPageButtons + 2)
    }

    // Add ellipsis before middle section if needed
    if (startPage > 2) {
      pages.push({
        number: -1,
        active: false,
        isEllipsis: true,
      })
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push({
        number: i,
        active: i === currentPage,
        isEllipsis: false,
      })
    }

    // Add ellipsis after middle section if needed
    if (endPage < totalPages - 1) {
      pages.push({
        number: -1,
        active: false,
        isEllipsis: true,
      })
    }

    // Always show last page if we have more than 1 page
    if (totalPages > 1) {
      pages.push({
        number: totalPages,
        active: currentPage === totalPages,
        isEllipsis: false,
      })
    }

    return pages
  }, [currentPage, totalPages, maxPageButtons])

  const handlePageChange = useCallback(
    (page: number) => {
      startTransition(() => {
        onPageChange(page)
      })
    },
    [onPageChange],
  )

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      startTransition(() => {
        onPageSizeChange(pageSize)
      })
    },
    [onPageSizeChange],
  )

  return (
    <div className="w-full bg-[#ffffff] rounded-lg shadow-[0px_1px_11.7px_1px_#b9b9b914] px-4 py-3">
      <div className="flex items-center justify-between w-full">
        <span className="font-normal text-gray-800 text-xs">
          {startItem}-{endItem} of {totalCount} items
        </span>

        <div className="flex items-center gap-6">
          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevious}
          >
            <ChevronLeftIcon
              className={`w-5 h-5 ${
                hasPrevious ? 'text-gray-600' : 'text-gray-300'
              }`}
            />
          </Button>

          <div className="flex items-start gap-3">
            {pageNumbers.map((page, index) =>
              page.isEllipsis ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-[30px] h-7 flex items-center justify-center font-normal text-gray-800 text-xs"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page.number}
                  size="icon"
                  variant={page.active ? 'default' : 'outline'}
                  onClick={() => handlePageChange(page.number)}
                >
                  {page.number}
                </Button>
              ),
            )}
          </div>

          <Button
            size="icon"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
          >
            <ChevronRightIcon
              className={`w-5 h-5 ${
                hasNext ? 'text-gray-600' : 'text-gray-300'
              }`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(Number(value))}
          >
            <SelectTrigger className=" h-7 border-0">
              <SelectValue>
                <span className="font-medium text-gray-800 text-xs">
                  {pageSize}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="font-normal text-[#1d2838] text-xs">
            Items per page
          </span>
        </div>
      </div>
    </div>
  )
}
