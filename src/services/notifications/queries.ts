import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { NotificationService } from './notification.service'

export const notificationsQueryOptions = (count?: number) =>
  queryOptions({
    queryKey: ['notifications', count],
    queryFn: () => NotificationService.getNotifications(count),
    staleTime: 30 * 60 * 1000,
    placeholderData: keepPreviousData,
  })
