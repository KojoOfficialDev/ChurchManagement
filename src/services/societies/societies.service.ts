import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export type Society = {
  name: string
  churchId: string
  isActive: boolean
  id: number
}
export class SocietiesService {
  static getAllSocieties = async () => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('id', churchId)
    const response = await protectedApi.get<Array<Society>>(
      `/Societies/GetAll?${searchParams.toString()}`,
    )
    return response.data
  }
  static createSociety = async ({ name }: { name: string }) => {
    const churchId = await this.getChurchId()

    const payload = {
      name,
      churchId,
      isActive: true,
      id: 0,
    } satisfies Society
    const response = await protectedApi.post('/Societies/Save', payload)
    return { value: response.data.id, label: response.data.name }
  }

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

  static editSociety = async (id: number, name: string) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post(`/Societies/update`, {
      name,
      id,
      churchId,
      isActive: true,
    })
    return response.data
  }

  static deleteSociety = async (id: number) => {
    const response = await protectedApi.delete(`/Societies/${id}`)
    return response.data
  }
}
