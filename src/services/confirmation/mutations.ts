import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ConfirmationService } from './confirmation.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const confirmationMutations = () => {
  const createConfirmation = useMutation({
    mutationFn: ConfirmationService.createConfirmation,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['confirmations'],
      })
      toast.success('Confirmation created successfully')
    },
    onError: () => {
      toast.error('Failed to create confirmation')
    },
  })
  return {
    createConfirmation,
  }
}
