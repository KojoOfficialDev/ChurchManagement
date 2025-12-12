import type { Role } from '@/lib/types'

export type Token = {
  name: string
  email: string
  userId: string
  churchName: string
  churchLogoUrl: string
  churchId: number
  tokenType: string
  accessToken: string
  expiresIn: number
  refreshToken: string
  claims: Array<any>
  roles: Array<Role>
}
export type SessionResponse = {
  token: Token
}
