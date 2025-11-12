import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ContributionService } from './contributions.service'
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

  const updateContribution = useMutation({
    mutationFn: ContributionService.updateContribution,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributions'],
      })
      toast.success('Contribution updated successfully')
    },
    onError: () => {
      toast.error('Failed to update contribution')
    },
  })

  const deleteContribution = useMutation({
    mutationFn: ContributionService.deleteContribution,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributions'],
      })
      toast.success('Contribution deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete contribution')
    },
  })

  return {
    createContribution,
    updateContribution,
    deleteContribution,
  }
}
