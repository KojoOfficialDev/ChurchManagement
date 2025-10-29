import { useMutation } from '@tanstack/react-query'
import { ContributionService } from './contributions.service'
import { toast } from 'sonner'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const contributionsMutations = () => {
  const createContribution = useMutation({
    mutationFn: ContributionService.createContribution,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributions'],
      })
      toast.success('Contribution created successfully')
    },
    onError: () => {
      toast.error('Failed to create contribution')
    },
  })
  return {
    createContribution,
  }
}

