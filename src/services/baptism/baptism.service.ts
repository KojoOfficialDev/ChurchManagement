import { sessionOptions } from '../auth/queries'
import type { BaptismResponse } from './types'
import type { Baptism, UpdateBaptism } from './baptism.dto'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class BaptismService {
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

  static getBaptisms = async ({
    page = 1,
    pageSize = 15,
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
    const response = await protectedApi.get<BaptismResponse>(
      '/baptism/getAllBaptism',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createBaptism = async (baptism: Baptism) => {
    const churchId = await this.getChurchId()
    const payload = {
      ...baptism,
      churchId,
    }
    const response = await protectedApi.post<BaptismResponse>(
      '/baptism/save',
      payload,
    )
    return response.data
  }

  static updateBaptism = async (baptism: UpdateBaptism) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post('/baptism/update', {
      ...baptism,
      churchId,
    })
    return response.data
  }

  static removeBaptism = async (memberId: string) => {
    const response = await protectedApi.delete(`/Baptism/delete?id=${memberId}`)
    return response.data
  }

  static getAllBaptisms = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get('/baptism/getAll', {
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

    const response = await protectedApi.post('/Baptism/BulkUpload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: {
        churchId,
      },
    })

    return response.data
  }
}
