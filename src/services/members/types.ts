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
  homeTown: string
  placeOfResidence: string
  homeAddress: string
  email: string
  phoneNumber: string
  academicQualification: string
  occupation: string
  isActive: boolean
  membershipNumber: string
  belongsToSociety: boolean
  societyName: Array<string>
}

export type GetAllMembersResponse = Pagination & {
  data: Array<Member>
}
