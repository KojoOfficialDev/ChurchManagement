import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { SmsBundlesService } from './smsbundles.service'

export const getSmsBundlesOptions = () =>
  queryOptions({
    queryKey: ['sms-bundles'],
    queryFn: () => SmsBundlesService.getSmsBundles(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

export const getPurchaseHistoriesOptions = ({
  startDate,
  endDate,
}: {
  startDate?: string
  endDate?: string
} = {}) =>
  queryOptions({
    queryKey: ['purchase-histories', startDate, endDate],
    queryFn: () => SmsBundlesService.getPurchaseHistory({ startDate, endDate }),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
