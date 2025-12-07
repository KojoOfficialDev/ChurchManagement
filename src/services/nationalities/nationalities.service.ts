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
      churchId,
      id: 0,
      active: true,
    }

    const response = await protectedApi.post<Nationalities>(
      '/nationalities/save',
      payload,
    )
    return { value: response.data.id, label: response.data.name }
  }

  static updateNationality = async (id: string, name: string) => {
    const churchId = await this.getChurchId()
    const payload = {
      id,
      name,
      churchId,
      active: true,
    }
    const response = await protectedApi.post<Nationalities>(
      '/nationalities/update',
      payload,
    )
    return response.data
  }

  static deleteNationality = async (id: string) => {
    const response = await protectedApi.delete(`/nationalities/${id}`)
    return response.data
  }
}
