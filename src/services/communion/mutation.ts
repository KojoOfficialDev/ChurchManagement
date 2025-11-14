import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CommunionService } from './communion.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const communionMutations = () => {
  const createCommunion = useMutation({
    mutationFn: CommunionService.createCommunion,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['communions'],
      })
      toast.success('Communion created successfully')
    },
    onError: () => {
      toast.error('Failed to create communion')
    },
  })

  const updateCommunion = useMutation({
    mutationFn: CommunionService.updateCommunion,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['communions'] })
      toast.success('Communion record updated successfully')
    },
    onError: () => {
      toast.error('Failed to update communion record')
    },
  })

  const removeCommunion = useMutation({
    mutationKey: ['removeCommunion'],
    mutationFn: CommunionService.removeCommunion,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['communions'] })
      toast.success('Communion record removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove communion record')
    },
  })

  return {
    createCommunion,
    updateCommunion,
    removeCommunion,
  }
}
