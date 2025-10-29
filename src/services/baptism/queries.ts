import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { BaptismService } from './baptism.service'

export const getBaptismsOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['baptisms', page, pageSize, search],
    queryFn: () => BaptismService.getBaptisms({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
