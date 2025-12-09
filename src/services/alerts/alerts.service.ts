import { sessionOptions } from '../auth/queries'
import type { CreateAlertTemplate, UpdateAlertTemplate } from './alerts.dto'
import type {
  AlertMessage,
  AlertMessagesResponse,
  AlertTemplate,
} from './types'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class AlertsService {
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

  static createAlertTemplate = async (alertTemplate: CreateAlertTemplate) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<AlertTemplate>(
      '/MessageTemplates/Save',
      {
        ...alertTemplate,
        churchId,
      },
    )
    return response.data
  }
  static getAlertTemplates = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<AlertTemplate>>(
      '/MessageTemplates/GetAll',
      {
        params: {
          id: churchId,
        },
      },
    )
    return response.data
  }

  static updateAlertTemplate = async (template: UpdateAlertTemplate) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<AlertTemplate>(
      '/MessageTemplates/Update',
      {
        ...template,
        churchId,
      },
    )
    return response.data
  }

  static deleteAlertTemplate = async (templateId: string) => {
    const response = await protectedApi.delete(
      `/MessageTemplates/Delete?id=${templateId}`,
    )
    return response.data
  }

  static getAllMessage = async ({
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
    if (search) {
      searchParams.append('search', search)
    }
    searchParams.append('id', churchId)
    const response = await protectedApi.get<AlertMessagesResponse>(
      'Messaging/GetAllMessages',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static getAll = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<AlertMessage>>(
      'Messaging/GetAllMessages',
      {
        params: {
          churchId,
        },
      },
    )
    return response.data
  }

  static removeAlertMessage = async (messageId: string) => {
    const response = await protectedApi.delete(
      `/Messaging/Delete?id=${messageId}`,
    )
    return response.data
  }

  static updateAlertMessage = async (message: any) => {
    const response = await protectedApi.post('/Messaging/Update', message)
    return response.data
  }

  static createAlertMessage = async (message: any) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post('/Messaging/send', {
      ...message,
      churchId: Number(churchId),
    })
    return response.data
  }
}
