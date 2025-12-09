import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertsService } from './alerts.service'
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

  const deleteAlertTemplate = useMutation({
    mutationKey: ['deleteAlertTemplate'],
    mutationFn: AlertsService.deleteAlertTemplate,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['alertTemplates'] })
      toast.success('Alert template deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete alert template')
    },
  })

  const editAlertTemplate = useMutation({
    mutationKey: ['updateAlertTemplate'],
    mutationFn: AlertsService.updateAlertTemplate,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['alertTemplates'] })
      toast.success('Alert template updated successfully')
    },
    onError: () => {
      toast.error('Failed to update alert template')
    },
  })

  return {
    createAlertMessage,
    createAlertTemplate,
    removeAlertMessage,
    updateAlertMessage,
    deleteAlertTemplate,
    editAlertTemplate,
  }
}
