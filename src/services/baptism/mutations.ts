import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { BaptismService } from './baptism.service'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export const useBaptismsMutations = () => {
  const createBaptism = useMutation({
    mutationFn: BaptismService.createBaptism,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['baptisms'] })
      toast.success('Baptism record created successfully')
    },
    onError: () => {
      toast.error('Failed to create baptism record')
    },
  })

  const updateBaptism = useMutation({
    mutationFn: BaptismService.updateBaptism,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['baptisms'] })
      toast.success('Baptism record updated successfully')
    },
    onError: () => {
      toast.error('Failed to update baptism record')
    },
  })

  const removeBaptism = useMutation({
    mutationKey: ['removeBaptism'],
    mutationFn: BaptismService.removeBaptism,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['baptisms'] })
      toast.success('Baptism record removed successfully')
    },
    onError: () => {
      toast.error('Failed to remove baptism record')
    },
  })

  const bulkUpload = useMutation({
    mutationKey: ['bulkUploadBaptisms'],
    mutationFn: BaptismService.bulkUpload,
    onSuccess: async () => {
      const queryClient = getContext().queryClient
      await queryClient.invalidateQueries({ queryKey: ['baptisms'] })
      toast.success('Baptism records uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload baptism records')
    },
  })

  return {
    removeBaptism,
    createBaptism,
    updateBaptism,
    bulkUpload,
  }
}
