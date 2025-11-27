import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { SubscriptionsService } from './subscriptions.service'
import { AxiosError } from 'axios'

export const subscriptionQueryOptions = () =>
  queryOptions({
    queryKey: ['subscription'],
    queryFn: () => SubscriptionsService.getSubscription(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    throwOnError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return false
        }
      }
      return true
    },
    retry: (_failureCount, error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return false
        }
      }
      return true
    },
  })

export const plansQueryOptions = () =>
  queryOptions({
    queryKey: ['plans'],
    queryFn: () => SubscriptionsService.getPlans(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

export const subscriptionHistoryQueryOptions = () =>
  queryOptions({
    queryKey: ['subscription-history'],
    queryFn: () => SubscriptionsService.getSubsriptionHistory(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
