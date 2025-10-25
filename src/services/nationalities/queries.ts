import { queryOptions } from '@tanstack/react-query'
import { NationalitiesService } from '@/services/nationalities/nationalities.service'

export const getNationalitiesOptions = queryOptions({
  queryKey: ['nationalities'],
  queryFn: NationalitiesService.getNationalities,
  staleTime: 5 * 60 * 1000, // 5 minutes
})
