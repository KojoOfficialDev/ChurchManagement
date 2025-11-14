import { sessionOptions } from '../auth/queries'
import type { ContributionResponse } from './types'
import type { Contribution } from './contributions.dto'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class ContributionService {
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

  static getContributions = async ({
    page,
    pageSize,
    search,
  }: {
    page: number
    pageSize: number
    search?: string
  }) => {
    const churchId = await this.getChurchId()
    const searchParams = new URLSearchParams()
    searchParams.append('page', page.toString())
    searchParams.append('pageSize', pageSize.toString())
    searchParams.append('id', churchId)
    if (search) {
      searchParams.append('search', search)
    }
    const response = await protectedApi.get<ContributionResponse>(
      '/contributions/getAllContributions',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createContribution = async (contribution: Contribution) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<Contribution>(
      '/contributions/save',
      {
        ...contribution,
        churchId,
      },
    )
    return response.data
  }

  static updateContribution = async (
    contribution: Contribution & { id: string },
  ) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<Contribution>(
      '/contributions/update',
      {
        ...contribution,
        churchId,
      },
    )
    return response.data
  }

  static deleteContribution = async (id: string) => {
    const response = await protectedApi.delete<Contribution>(
      `/contributions/${id}`,
    )
    return response.data
  }

  static getAllContributions = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get('/contributions/getAll', {
      params: {
        id: churchId,
      },
    })
    return response.data
  }
}
