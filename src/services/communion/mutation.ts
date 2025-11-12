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
  return {
    createCommunion,
  }
}
