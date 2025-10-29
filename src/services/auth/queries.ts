import { queryOptions } from '@tanstack/react-query'
import type { Token } from '@/services/auth/types'
import { api } from '@/server/api'

export class AuthQueries {
  static refreshToken = async () => {
    const response = await api.post<Token>('connect/refresh')
    return response.data
  }
}

export const sessionOptions = queryOptions({
  queryKey: ['session'],
  queryFn: AuthQueries.refreshToken,
  staleTime: Infinity,
  gcTime: Infinity,
})
