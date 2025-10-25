import { useMutation } from '@tanstack/react-query'
import { MarriageService } from './marriage.service'
import { toast } from 'sonner'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useMarriagesMutations = () => {
  const createMarriage = useMutation({
    mutationKey: ['createMarriage'],
    mutationFn: MarriageService.createMarriage,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      toast.success('Marriage created successfully')
      queryClient.invalidateQueries({
        queryKey: ['marriages'],
      })
    },
    onError: () => {
      toast.error('Failed to create marriage')
    },
  })
  return {
    createMarriage,
  }
}
