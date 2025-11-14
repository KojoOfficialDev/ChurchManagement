import { churchProfileQuery } from './queries'
import type { ChurchProfile } from './setup.dto'
import type { Church } from './types'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '@/services/auth/queries'

export class SetupService {
  private static queryClient = getContext().queryClient
  private static getChurchId = async () => {
    const churchId = await this.queryClient
      .ensureQueryData(sessionOptions)
      .then((data) => data.churchId)
      .catch(() => null)
    if (!churchId) {
      throw new Error('Church ID not found')
    }
    return churchId.toString()
  }

  static updateChurchProfile = async (payload: ChurchProfile) => {
    const churchId = await this.getChurchId()
    const churchData = this.queryClient.getQueryData(
      churchProfileQuery.queryKey,
    )
    const response = await protectedApi.post('ChurchSetups/Update', {
      ...churchData,
      ...payload,
      id: churchId,
    })
    return response.data
  }

  static getChurchProfile = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Church>('ChurchSetups/Get', {
      params: { id: churchId },
    })
    return response.data
  }
}
