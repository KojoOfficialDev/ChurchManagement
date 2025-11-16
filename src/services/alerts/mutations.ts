import { useMutation } from '@tanstack/react-query'
import { AlertsService } from './alerts.service'
import { toast } from 'sonner'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useAlertsMutations = () => {
  const createAlertTemplate = useMutation({
    mutationFn: AlertsService.createAlertTemplate,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.invalidateQueries({
        queryKey: ['alertTemplates'],
      })
      toast.success('Alert template created successfully')
    },
    onError: () => {
      toast.error('Failed to create alert template')
    },
  })

  const removeAlertMessage = useMutation({
    mutationKey: ['removeAlertMessage'],
    mutationFn: AlertsService.removeAlertMessage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['alertMessages'] })
      toast.success('Alert message removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove alert message')
    },
  })

  const updateAlertMessage = useMutation({
    mutationKey: ['updateAlertMessage'],
    mutationFn: AlertsService.updateAlertMessage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['alertMessages'] })
      toast.success('Alert message updated successfully')
    },
    onError: () => {
      toast.error('Failed to update alert message')
    },
  })

  const createAlertMessage = useMutation({
    mutationKey: ['createAlertMessage'],
    mutationFn: AlertsService.createAlertMessage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['alertMessages'] })
      toast.success('Alert message created successfully')
    },
    onError: () => {
      toast.error('Failed to create alert message')
    },
  })

  return {
    createAlertMessage,
    createAlertTemplate,
    removeAlertMessage,
    updateAlertMessage,
  }
}
