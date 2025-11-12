export type User = {
  id: string
  userName: string
  normalizedUserName: string
  email: string
  normalizedEmail: string
  emailConfirmed: true
  passwordHash: string
  securityStamp: string
  concurrencyStamp: string
  phoneNumber: string
  phoneNumberConfirmed: true
  twoFactorEnabled: true
  lockoutEnd: string
  lockoutEnabled: true
  accessFailedCount: number
  initials: string
  clientId: string
  clientName: string
  description: string
  accessTokenLifeTime: number
  absoluteRefreshTokenLifetime: number
  clientClaimsPrefix: string
  active: true
  userType: number
  userCode: string
  msisdn: string
  fullName: string
  password: string
  accessRole: string
}

export type UserRole = 'Admin' | 'Finance' | 'Auditor'

export type UserStatus = 'Active' | 'Inactive'

export type UserTableData = {
  id: string
  fullName: string
  email: string
  role: UserRole
  addedOn: string
  status: UserStatus
}

export type UsersQueryParams = {
  page: number
  pageSize: number
  search?: string
  role?: UserRole | 'All Category'
  status?: UserStatus | 'All Status'
}

export type PaginatedUsersResponse = {
  data: Array<UserTableData>
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}
