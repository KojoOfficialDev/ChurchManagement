import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SocietiesService } from '@/services/societies/societies.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useSocietiesMutations = () => {
  const createSociety = useMutation({
    mutationKey: ['createSociety'],
    mutationFn: SocietiesService.createSociety,
  })

  const deleteSociety = useMutation({
    mutationKey: ['deleteSociety'],
    mutationFn: SocietiesService.deleteSociety,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['societies'] })
    },
    onError: () => {
      toast.error('Failed to delete society')
    },
  })

  const editSociety = useMutation({
    mutationKey: ['editSociety'],
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      SocietiesService.editSociety(id, name),
    onSuccess: async () => {
      toast.success('Society updated')
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['societies'] })
    },
    onError: () => {
      toast.error('Failed to edit society')
    },
  })

  return {
    createSociety,
    deleteSociety,
    editSociety,
  }
}
