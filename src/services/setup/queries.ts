import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { SetupService } from '@/services/setup/setup.service'

export const churchProfileQuery = queryOptions({
  queryKey: ['church-profile'],
  queryFn: () => SetupService.getChurchProfile(),
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  placeholderData: keepPreviousData,
})
