export type Member = {
  id: string
  firstName: string
  lastName: string
  middleName: string
  gender: string
  dob: string
  placeOfBirth: string
  nationality: string
  region: string
  homeTown: string
  placeOfResidence: string
  homeAddress: string
  email: string
  phone: string
  academicQualification: string
  occupation: string
  isActive: boolean
  membershipNumber: string
  belongsToSociety: boolean
  societyName: string[]
}

export type GetAllMembersResponse = {
  data: Member[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}
