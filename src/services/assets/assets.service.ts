import { protectedApi } from '@/server/protected-api'

export class AssetsService {
  static uploadImage = async (file: File) => {
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
      },
    )

    return response.data
  }

  static uploadDocument = async (file: File) => {
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
      },
    )

    return response.data
  }
}
