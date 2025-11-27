import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { SmsBundlesService } from './smsbundles.service'

export const useSmsBundlesMutations = () => {
  const purchaseSmsBundle = useMutation({
    mutationFn: SmsBundlesService.purchaseSmsBundle,
    onSuccess: () => {
      toast.success('SMS bundle purchased successfully')
    },
    onError: () => {
      toast.error('Failed to purchase SMS bundle')
    },
  })
  return {
    purchaseSmsBundle,
  }
}
