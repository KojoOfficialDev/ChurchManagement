import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { ConfirmationService } from './confirmation.service'

export const confirmationQueryOptions = ({
  page,
  pageSize,
  search,
}: {
  page: number
  pageSize: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['confirmations', page, pageSize, search],
    queryFn: () =>
      ConfirmationService.getConfirmations({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })


