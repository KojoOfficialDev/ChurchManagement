import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ContributionTypeService } from './contribution-types.service'
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

  const updateContributionType = useMutation({
    mutationFn: ContributionTypeService.updateContributionType,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributionTypes'],
      })
      toast.success('Contribution type updated successfully')
    },
    onError: () => {
      toast.error('Failed to update contribution type')
    },
  })

  const deleteContributionType = useMutation({
    mutationFn: ContributionTypeService.deleteContributionType,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['contributionTypes'],
      })
      toast.success('Contribution type deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete contribution type')
    },
  })
  return {
    createContributionType,
    updateContributionType,
    deleteContributionType,
  }
}
