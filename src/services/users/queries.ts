import { queryOptions } from '@tanstack/react-query'
import type { User, UsersQueryParams } from '@/services/users/types'
import { protectedApi } from '@/server/api'
import { UsersService } from './users.service'

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

export const getAllUsersOptions = (params: UsersQueryParams) =>
  queryOptions({
    queryKey: ['users', params],
    queryFn: () => UsersService.getAllUsers(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
