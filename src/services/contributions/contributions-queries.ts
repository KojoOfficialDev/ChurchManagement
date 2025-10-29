import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { ContributionService } from './contributions.service'

export const contributionsQueryOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['contributions', page, pageSize, search],
    queryFn: () =>
      ContributionService.getContributions({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

