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

  const updateConfirmation = useMutation({
    mutationFn: ConfirmationService.updateConfirmation,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['confirmations'] })
      toast.success('Confirmation updated successfully')
    },
    onError: () => {
      toast.error('Failed to update confirmation')
    },
  })

  const removeConfirmation = useMutation({
    mutationKey: ['removeConfirmation'],
    mutationFn: ConfirmationService.removeConfirmation,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['confirmations'] })
      toast.success('Confirmation record removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove confirmation record')
    },
  })

  return {
    createConfirmation,
    updateConfirmation,
    removeConfirmation,
  }
}
