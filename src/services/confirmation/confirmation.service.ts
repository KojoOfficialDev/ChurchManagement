import { protectedApi } from '@/server/protected-api'
import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import type { ConfirmationResponse } from './types'
import type { Confirmation } from './confirmation.dto'

export class ConfirmationService {
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

  static getConfirmations = async ({
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
    const response = await protectedApi.get<ConfirmationResponse>(
      '/Confirmation/GetAllConfirmations',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createConfirmation = async (confirmation: Confirmation) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<Confirmation>(
      '/Confirmation/Save',
      {
        ...confirmation,
        churchId,
      },
    )
    return response.data
  }
}


