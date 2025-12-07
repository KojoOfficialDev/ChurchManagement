import { sessionOptions } from '../auth/queries'
import type { Notification } from './types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class NotificationService {
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

  static getNotifications = async (count?: number) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<Notification>>(
      '/Activities/recent',
      {
        params: { churchId, count: count ?? 20 },
      },
    )
    return response.data
  }
}
