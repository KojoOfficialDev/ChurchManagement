import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

type CreateSocietyPayload = {
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
    const response = await protectedApi.get<Array<CreateSocietyPayload>>(
      `/Societies/GetAll?${searchParams.toString()}`,
    )
    return response.data
  }
  static createSociety = async (name: string) => {
    const churchId = await this.getChurchId()

    const payload = {
      name,
      churchId,
      isActive: true,
      id: 0,
    } satisfies CreateSocietyPayload
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
}
