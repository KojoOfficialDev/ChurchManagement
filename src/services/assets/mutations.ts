import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AssetsService } from '@/services/assets/assets.service'

export const useAssetsMutations = () => {
  const uploadImage = useMutation({
    mutationKey: ['uploadImage'],
    mutationFn: AssetsService.uploadImage,
    onSuccess: () => {
      toast.success('Image uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload image')
    },
  })

  const uploadDocument = useMutation({
    mutationKey: ['uploadDocument'],
    mutationFn: AssetsService.uploadDocument,
    onSuccess: () => {
      toast.success('Document uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to upload document')
    },
  })

  return {
    uploadImage,
    uploadDocument,
  }
}
