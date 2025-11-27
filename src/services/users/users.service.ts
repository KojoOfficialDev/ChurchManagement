// Mock data for users

import { protectedApi } from '@/server/protected-api'
import type { User } from './types'
import type { CreateUser } from './users.dto'
import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class usersService {
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
  static async getAllUsers() {
    const response = await protectedApi.get<User[]>('ChurchUsers/GetAppUsers')
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
}
