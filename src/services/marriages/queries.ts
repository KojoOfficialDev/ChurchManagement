import { queryOptions } from '@tanstack/react-query'
import { MarriageService } from '@/services/marriages/marriage.service'

export const getMarriagesOptions = queryOptions({
  queryKey: ['marriages'],
  queryFn: MarriageService.getMarriages,
  staleTime: 30 * 60 * 1000, // 30 minutes
})
