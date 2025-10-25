import { protectedApi } from '@/server/protected-api'
import type { CreateMarriage } from './marriage.dto'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '../auth/queries'
import type { Marriage } from './types'

export class MarriageService {
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

  static createMarriage = async (marriage: CreateMarriage) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post('/marriage/save', {
      ...marriage,
      churchId: churchId,
    })
    return response.data
  }

  static getMarriages = async () => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('id', churchId)
    const response = await protectedApi.get<Marriage[]>('/marriage/getAll', {
      params: searchParams,
    })
    return response.data
  }
}
