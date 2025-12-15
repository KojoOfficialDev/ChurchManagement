import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { sessionOptions } from '@/services/auth/queries'

export class AssetsService {
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
  static uploadImage = async (file: File) => {
    const churchId = await this.getChurchId()
    const formData = new FormData()
    formData.append('file', file)

    // returns a plain/text response
    const response = await protectedApi.post<string>(
      '/ChurchSetups/UploadImage',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'text' as const,
        params: {
          churchId,
        },
      },
    )

    return response.data
  }

  static uploadDocument = async (file: File) => {
    const churchId = await this.getChurchId()
    const formData = new FormData()
    formData.append('file', file)

    // returns a plain/text response with the file URL
    const response = await protectedApi.post<string>(
      '/ChurchSetups/UploadImage',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'text' as const,
        params: {
          churchId,
        },
      },
    )

    return response.data
  }
}
