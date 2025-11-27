import { queryOptions } from '@tanstack/react-query'
import { usersService } from './users.service'

export const getAllUsersOptions = () =>
  queryOptions({
    queryKey: ['users'],
    queryFn: usersService.getAllUsers,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
