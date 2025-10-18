import type { User } from '@/services/users/types'
import { protectedApi } from '@/server/api'
import { queryOptions } from '@tanstack/react-query'

export class UsersQueries {
  static getUserProfile = async () => {
    const response = await protectedApi.get<User>(`/users/profile`)
    return response.data
  }
}

export const userProfileOptions = queryOptions({
  queryKey: ['userProfile'],
  queryFn: UsersQueries.getUserProfile,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
})
