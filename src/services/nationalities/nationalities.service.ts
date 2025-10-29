import { sessionOptions } from '../auth/queries'
import type { Nationalities } from '@/services/nationalities/types'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class NationalitiesService {
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

  static getNationalities = async () => {
    const id = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('id', id)
    const response = await protectedApi.get<Array<Nationalities>>(
      `/nationalities/getAll?${searchParams.toString()}`,
    )
    return response.data
  }
  static createNationality = async (nationality: string) => {
    const churchId = await this.getChurchId()

    const payload = {
      name: nationality,
      churchId: churchId,
      id: 0,
    }

    const response = await protectedApi.post<Nationalities>('/nationalities/save', payload)
    return { value: response.data.id, label: response.data.name }
  }
}
