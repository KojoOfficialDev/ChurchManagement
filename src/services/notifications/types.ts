export type Notification = {
  createdDate: string
  createdBy: string
  modifiedDate: string
  modifiedBy: string
  isActive: boolean
  id: number
  tableName: string | null
  action: string | null
  timestamp: string
  origin: number
  userId: string
}
