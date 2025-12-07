// Mock data for users

import { sessionOptions } from '../auth/queries'
import type { User } from './types'
import type { CreateUser, UpdateUser } from './users.dto'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class usersService {
  private static queryClient = getContext().queryClient
  private static async getChurchId() {
    const churchId = await this.queryClient
      .ensureQueryData(sessionOptions)
      .then((data) => data.churchId)
      .catch(() => null)
    if (!churchId) {
      throw new Error('Church ID not found')
    }
    return churchId.toString()
  }

  static async getAllUsers() {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<User>>(
      'ChurchUsers/GetAppUsers',
      {
        params: {
          churchId,
        },
      },
    )
    return response.data
  }

  static async createUser(user: CreateUser) {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<User>('ChurchUsers/postUser', {
      ...user,
      churchId,
    })
    return response.data
  }

  static async removeUser(id: string) {
    const response = await protectedApi.delete(`/ChurchUsers/${id}`)
    return response.data
  }

  static async updateUser(user: UpdateUser) {
    const churchId = await this.getChurchId()
    const response = await protectedApi.put<User>(`/ChurchUsers/putUser`, {
      ...user,
      churchId,
    })
    return response.data
  }
}
