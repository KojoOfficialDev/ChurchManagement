import { getContext } from '@/integrations/tanstack-query/root-provider'
import { api } from '@/server/api'
import type { LoginSchema } from '@/services/auth/auth.dto'
import type { SessionResponse } from '@/services/auth/types'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { sessionOptions } from './queries'

export class AuthMutations {
  static login = async (data: LoginSchema) => {
    const response = await api.post<SessionResponse>('/login', data)
    return response.data
  }
}

export const useAuthMutations = () => {
  const login = useMutation({
    mutationKey: ['login'],
    mutationFn: AuthMutations.login,
    onSuccess: (data) => {
      // set the refresh token in the local storage
      console.log("data", data)
      localStorage.setItem('refreshToken', data.refreshToken)

      // set the access token in the query client
      const queryClient = getContext().queryClient
      queryClient.setQueryData(sessionOptions.queryKey, data)

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
  return { login }
}
