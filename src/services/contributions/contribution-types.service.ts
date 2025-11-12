import { sessionOptions } from '../auth/queries'
import type { ContributionType } from './contributions.dto'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class ContributionTypeService {
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

  static getContributionTypes = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<
      Array<ContributionType & { id: string }>
    >('/ContributionTypes/GetAll', {
      params: { id: churchId },
    })
    return response.data
  }

  static createContributionType = async (
    contributionType: ContributionType,
  ) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<ContributionType>(
      '/contributionTypes/save',
      {
        ...contributionType,
        churchId,
      },
    )
    return response.data
  }

  static updateContributionType = async (
    contributionType: ContributionType & { id: string },
  ) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.put<ContributionType>(
      '/contributionTypes/update',
      {
        ...contributionType,
        churchId,
      },
    )
    return response.data
  }

  static deleteContributionType = async (id: string) => {
    const response = await protectedApi.delete<ContributionType>(
      `/contributionTypes/${id}`,
    )
    return response.data
  }
}
