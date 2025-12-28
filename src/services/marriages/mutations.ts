import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { MarriageService } from './marriage.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useMarriagesMutations = () => {
  const createMarriage = useMutation({
    mutationKey: ['createMarriage'],
    mutationFn: MarriageService.createMarriage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      toast.success('Marriage created successfully')
      await queryClient.invalidateQueries({
        queryKey: ['marriages'],
      })
    },
    onError: () => {
      toast.error('Failed to create marriage')
    },
  })

  const updateMarriage = useMutation({
    mutationKey: ['updateMarriage'],
    mutationFn: MarriageService.updateMarriage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['marriages'] })
      toast.success('Marriage record updated successfully')
    },
    onError: () => {
      toast.error('Failed to update marriage')
    },
  })

  const removeMarriage = useMutation({
    mutationKey: ['removeMarriage'],
    mutationFn: MarriageService.removeMarriage,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['marriages'] })
      toast.success('Marriage record removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove marriage record')
    },
  })

  const bulkUpload = useMutation({
    mutationKey: ['bulkUploadMarriages'],
    mutationFn: MarriageService.bulkUpload,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['marriages'] })
      toast.success('Marriage records uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload marriage records')
    },
  })

  return {
    createMarriage,
    updateMarriage,
    removeMarriage,
    bulkUpload,
  }
}
