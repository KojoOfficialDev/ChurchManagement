import { api } from '@/server/api'
import type { SessionResponse } from '@/services/auth/types'
import { queryOptions } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
export class AuthQueries {
  /**
   * Refresh the token
   * uses the refresh token in the local storage
   * returns the new access token
   */
  static refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw redirect({ to: '/login' })
    }
    const response = await api.post<SessionResponse>('/refresh', {
      refreshToken,
    })
    return response.data
  }
}

export const sessionOptions = queryOptions({
  queryKey: ['session'],
  queryFn: AuthQueries.refreshToken,
  staleTime: 1000 * 60 * 5,
  refetchOnWindowFocus: false,
})
