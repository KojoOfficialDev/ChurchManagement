import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'
import { sessionOptions } from '@/services/auth/queries'
import type { CreateMember } from '@/services/members/members.dto'
import type { GetAllMembersResponse } from '@/services/members/types'

export class MembersService {
  private static getChurchId = async () => {
    const queryClient = getContext().queryClient
    const churchId = await queryClient
      .ensureQueryData(sessionOptions)
      .then((data) => data.churchId)
      .catch(() => null)
    if (!churchId) {
      throw new Error('Church ID not found')
    }
    return churchId.toString()
  }

  static generateMemberId = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<string>(
      `/Member/GenerateId?id=${churchId}`,
    )
    return response.data
  }

  static getAllMembers = async ({ page = 1, pageSize = 10 }) => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('page', page.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('churchId', churchId)
    const response = await protectedApi.get<GetAllMembersResponse>(
      '/Member/getAllMembers',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createMember = async (member: CreateMember) => {
    const churchId = await this.getChurchId()
    const payload = {
      ...member,
      churchId: churchId,
    }
    const response = await protectedApi.post('/Member/Save', {
      ...payload,
    })
    return response.data
  }
}
