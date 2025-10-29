import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { CommunionService } from './communion.service'

export const communionQueryOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['communions', page, pageSize, search],
    queryFn: () => CommunionService.getCommunions({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
