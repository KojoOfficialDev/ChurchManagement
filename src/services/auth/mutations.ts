import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { sessionOptions } from './queries'
import type { SessionResponse } from '@/services/auth/types'
import type { LoginSchema } from '@/services/auth/auth.dto'
import { api } from '@/server/api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class AuthMutations {
  static login = async (data: LoginSchema) => {
    const response = await api.post<SessionResponse>(`/connect/login`, data)
    return response.data
  }
  static logout = async () => {
    const response = await api.post(`/connect/logout`)
    return response.data
  }
}

export const useAuthMutations = () => {
  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: AuthMutations.login,
    onSuccess: (data) => {
      const queryClient = getContext().queryClient
      queryClient.setQueryData(sessionOptions.queryKey, data.token)

      // redirect to the dashboard
      toast.success('Login successful')
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error('Invalid email or password')
          return
        }
      }
      toast.error('An error occurred')
      return
    },
  })

  const logout = useMutation({
    mutationKey: ['logout'],
    mutationFn: AuthMutations.logout,
    onSuccess: () => {
      const queryClient = getContext().queryClient
      queryClient.removeQueries()
      toast.success('Logout successful')
    },
    onError: () => {
      toast.error('Failed to logout')
    },
  })

  return { login, logout }
}
