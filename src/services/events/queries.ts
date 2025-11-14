import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { EventsService } from './events.service'

export const eventsQueryOptions = ({
  page = 1,
  pageSize = 15,
  search = '',
}: {
  page?: number
  pageSize?: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['events', { page, pageSize, search }],
    queryFn: () => EventsService.getEvents({ page, pageSize, search }),
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })

export const upcomingEventsQueryOptions = () =>
  queryOptions({
    queryKey: ['upcomingEvents'],
    queryFn: () => EventsService.getUpcomingEvents(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
