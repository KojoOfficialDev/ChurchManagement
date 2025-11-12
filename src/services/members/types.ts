import type { Pagination } from '@/lib/types'

export type Member = {
  id: string
  firstName: string
  lastName: string
  middleName: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  region: string
  homeDistrict: string
  placeOfStay: string
  houseNumber: string
  email: string
  phoneNumber: string
  educationalLevel: string
  occupation: string
  isActive: boolean
  membershipNumber: string
  belongsToSociety: boolean
  societyName: Array<string>
}

export type GetAllMembersResponse = Pagination & {
  data: Array<Member>
}
