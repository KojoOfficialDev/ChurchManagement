import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '@/services/auth/queries'

export const RefreshToken = async () => {
  const queryClient = getContext().queryClient
  await queryClient.invalidateQueries({ queryKey: sessionOptions.queryKey })
  const newSession = await queryClient
    .fetchQuery(sessionOptions)
    .catch(() => null)
  return newSession?.accessToken ?? null
}
