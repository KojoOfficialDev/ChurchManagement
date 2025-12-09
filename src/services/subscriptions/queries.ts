import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { SubscriptionsService } from './subscriptions.service'

export const subscriptionQueryOptions = () =>
  queryOptions({
    queryKey: ['subscription'],
    queryFn: async () => await SubscriptionsService.getSubscription(),
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
    queryFn: async () => await SubscriptionsService.getPlans(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

export const subscriptionHistoryQueryOptions = () =>
  queryOptions({
    queryKey: ['subscription-history'],
    queryFn: async () => await SubscriptionsService.getSubsriptionHistory(),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
