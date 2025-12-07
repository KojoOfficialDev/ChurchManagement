import type { Church } from '@/lib/types'

export type Nationalities = {
  id: string
  name: string
  churchId: string
  active: boolean
  church: Church
  isActive: boolean
}
