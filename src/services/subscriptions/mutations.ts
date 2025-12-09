import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { SubscriptionsService } from './subscriptions.service'
import type { Suscribe } from './types'

export const useSubscriptionsMutations = () => {
  const subscribe = useMutation({
    mutationFn: async (payload: Omit<Suscribe, 'churchId'>) =>
      await SubscriptionsService.subscribe(payload),
    onSuccess: () => {
      toast.success('Subscription created successfully')
    },
    onError: () => {
      toast.error('Failed to subscribe')
    },
  })
  return {
    subscribe,
  }
}
