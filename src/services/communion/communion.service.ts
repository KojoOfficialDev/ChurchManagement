import { sessionOptions } from '../auth/queries'
import type { CommunionResponse } from './types'
import type { Communion, UpdateCommunion } from './communion.dto'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class CommunionService {
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

  static getCommunions = async ({
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
    const response = await protectedApi.get<CommunionResponse>(
      '/FirstCommunion/GetAllFirstCommunion',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createCommunion = async (communion: Communion) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<Communion>(
      '/FirstCommunion/Save',
      {
        ...communion,
        churchId,
      },
    )
    return response.data
  }

  static updateCommunion = async (communion: UpdateCommunion) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post('/FirstCommunion/Update', {
      ...communion,
      churchId,
    })
    return response.data
  }

  static removeCommunion = async (communionId: string) => {
    const response = await protectedApi.delete(
      `/FirstCommunion/delete?id=${communionId}`,
    )
    return response.data
  }

  static getAllCommunions = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get('/FirstCommunion/getAll', {
      params: {
        id: churchId,
      },
    })
    return response.data
  }

  static bulkUpload = async (file: File) => {
    const churchId = await this.getChurchId()
    const formData = new FormData()
    formData.append('file', file)

    const response = await protectedApi.post(
      '/FirstCommunion/BulkUpload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: {
          churchId,
        },
      },
    )

    return response.data
  }
}
