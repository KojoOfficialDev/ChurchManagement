import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { MarriageService } from '@/services/marriages/marriage.service'

export const getMarriagesOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['marriages', page, pageSize, search],
    queryFn: () => MarriageService.getMarriages({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
  })
