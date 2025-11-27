import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '@/services/auth/queries'
import { protectedApi } from '@/server/protected-api'
import type { PurchaseHistory, SmsBundle } from './types'
import type { PurchaseSmsBundle } from './smsBundles.dto'

export type PurchaseHistoryArgs = {
  startDate?: string
  endDate?: string
}
export class SmsBundlesService {
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

  static getSmsBundles = async () => {
    const response = await protectedApi.get<Array<SmsBundle>>('/smsBundles')
    return response.data
  }

  static purchaseSmsBundle = async (payload: PurchaseSmsBundle) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<SmsBundle>(
      '/smsBundles/purchaseBundle',
      { ...payload, churchId },
    )
    return response.data
  }

  static getPurchaseHistory = async (args?: PurchaseHistoryArgs) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<PurchaseHistory>>(
      '/smsBundles/getPurchaseHistories',
      {
        params: { churchId, ...args },
      },
    )
    return response.data
  }
}
