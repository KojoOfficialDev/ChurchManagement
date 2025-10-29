import { sessionOptions } from '../auth/queries'
import type { CreateMarriage } from './marriage.dto'
import type { MarriageResponse } from './types'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

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

  static getMarriages = async ({
    pageSize = 15,
    page = 1,
    search,
  }: {
    pageSize: number
    page: number
    search?: string
  }) => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('page', page.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('id', churchId)
    if (search) {
      searchParams.append('search', search)
    }
    const response = await protectedApi.get<MarriageResponse>(
      '/marriage/getAllMarriages',
      {
        params: searchParams,
      },
    )
    return response.data
  }
}
