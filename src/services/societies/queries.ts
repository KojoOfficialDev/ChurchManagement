import { queryOptions } from '@tanstack/react-query'
import { SocietiesService } from '@/services/societies/societies.service'

export const getSocietiesOptions = queryOptions({
  queryKey: ['societies'],
  queryFn: SocietiesService.getAllSocieties,
  staleTime: 1000 * 60 * 60 * 24,
})
