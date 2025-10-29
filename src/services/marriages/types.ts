import type { Pagination } from '@/lib/types'

export type Marriage = {
  id: number
  marriageNumber: string
  coupleName: string
  placeOfMarriage: string
  marriageDate: string
  groomId: string
  groomWitness: string
  brideId: string
  brideWitness: string
  placeOfBirth: string
  placeOfStay: string
  homeDistrict: string
  groomParentName: string
  brideParentName: string
  revMinister: string
  churchId: number
  createdDate: Date
  createdBy: string
  modifiedDate: Date
  modifiedBy: string
  isActive: boolean
}

export type MarriageResponse = Pagination & {
  data: Array<Marriage>
}
