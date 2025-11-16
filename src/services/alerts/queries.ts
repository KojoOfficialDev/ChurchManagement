import { queryOptions } from '@tanstack/react-query'
import { AlertsService } from './alerts.service'

export const alertTemplatesOptions = queryOptions({
  queryKey: ['alertTemplates'],
  queryFn: AlertsService.getAlertTemplates,
  staleTime: 1000 * 60 * 2,
  refetchOnWindowFocus: false,
})

export const alertMessagesOptions = ({
  page = 1,
  pageSize = 15,
  search = '',
}: {
  page?: number
  pageSize?: number
  search?: string
}) =>
  queryOptions({
    queryKey: ['alertMessages', { page, pageSize, search }],
    queryFn: () => AlertsService.getAllMessage(),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
