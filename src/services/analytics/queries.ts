import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { AnalyticsService } from './analytics.service'

export const dashboardStatCountsQuery = queryOptions({
  queryKey: ['dashboardStatCounts'],
  queryFn: () => AnalyticsService.getDashboardStatCounts(),
  staleTime: 30 * 60 * 1000, // 30 minutes
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
})

export const monthlyContributionsDataQuery = ({ year }: { year: number }) =>
  queryOptions({
    queryKey: ['monthlyContributionsData', year],
    queryFn: () => AnalyticsService.getChartData({ year }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
