import { useMutation } from '@tanstack/react-query'
import { ContributionTypeService } from './contribution-types.service'
import { toast } from 'sonner'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const contributionTypesMutations = () => {
  const createContributionType = useMutation({
    mutationFn: ContributionTypeService.createContributionType,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributionTypes'],
      })
      toast.success('Contribution type created successfully')
    },
    onError: () => {
      toast.error('Failed to create contribution type')
    },
  })
  return {
    createContributionType,
  }
}

