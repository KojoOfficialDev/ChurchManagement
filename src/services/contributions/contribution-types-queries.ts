import { queryOptions } from '@tanstack/react-query'
import { ContributionTypeService } from './contribution-types.service'

export const contributionTypesQueryOptions = () =>
  queryOptions({
    queryKey: ['contributionTypes'],
    queryFn: () => ContributionTypeService.getContributionTypes(),
    staleTime: 5 * 60 * 1000,
  })
