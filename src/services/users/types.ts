import type { CreateUser } from "./users.dto"

export type User = CreateUser & {
  id: string
  normalizedUserName: string
  normalizedEmail: string
  emailConfirmed: boolean
  securityStamp: string
  concurrencyStamp: string
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: string
  lockoutEnabled: boolean
  accessFailedCount: number
  initials: string
  clientId: string
  clientName: string
  description: string
  accessTokenLifeTime: number
  absoluteRefreshTokenLifetime: number
  clientClaimsPrefix: string
  userType: number
  userCode: string
  msisdn: string
  fullName: string
}
