import type { Plan, SubscriptionHistory } from './types'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '@/services/auth/queries'

export class SubscriptionsService {
  private static getChurchId = async () => {
    const queryClient = getContext().queryClient
    const churchId = await queryClient
      .ensureQueryData(sessionOptions)
      .then((data) => data.churchId)
      .catch(() => null)
    if (!churchId) {
      throw new Error('Church ID not found')
    }
    return churchId.toString()
  }
  static getSubscription = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get(
      `/subscription/GetChurchSubscription/${churchId}`,
    )
    return response.data
  }

  static getPlans = async () => {
    const response = await protectedApi.get<Array<Plan>>(
      '/Subscription/GetAllSubscriptionTypes',
    )
    return response.data
  }

  static getSubsriptionHistory = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<SubscriptionHistory>>(
      'Subscription/GetAllChurchSubscriptionHistory',
      {
        params: {
          churchId,
        },
      },
    )
    return response.data
  }
}
