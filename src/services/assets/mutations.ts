import { useMutation } from '@tanstack/react-query'
import { AssetsService } from '@/services/assets/assets.service'
import { toast } from "sonner"

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

  return {
    uploadImage,
  }
}
