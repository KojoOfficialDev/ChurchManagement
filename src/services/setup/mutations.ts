import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SetupService } from './setup.service'

export const useSetupMutations = () => {
  const updateChurchProfile = useMutation({
    mutationKey: ['update-church-profile'],
    mutationFn: SetupService.updateChurchProfile,
    onError: () => {
      toast.error('Failed to update church profile')
    },
    onSuccess: () => {
      // on success reload the window
      window.location.reload()
      toast.success('Church profile updated successfully')
    },
  })
  const updateChurchNotificationSettings = useMutation({
    mutationKey: ['update-church-notification-settings'],
    mutationFn: SetupService.updateChurchNotificationSettings,
    onError: () => {
      toast.error('Failed to update notification settings')
    },
    onSuccess: () => {
      toast.success('Notification settings updated successfully')
    },
  })

  return {
    updateChurchProfile,
    updateChurchNotificationSettings,
  }
}
