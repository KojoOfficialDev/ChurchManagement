import { protectedApi } from '@/server/protected-api'
import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import type { ContributionType } from './contributions.dto'

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
      params: { churchId },
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
}
