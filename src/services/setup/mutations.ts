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
  })

  return {
    updateChurchProfile,
  }
}
