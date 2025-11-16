import { protectedApi } from '@/server/protected-api'
import { type CreateAlertTemplate } from './alerts.dto'
import type { AlertTemplate } from './types'
import { sessionOptions } from '../auth/queries'
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
    const response = await protectedApi.get<AlertTemplate[]>(
      '/MessageTemplates/GetAll',
      {
        params: {
          id: churchId,
        },
      },
    )
    return response.data
  }

  static getAllMessage = async () => {
    const response = await protectedApi.get('Messaging/GetAllMessages')
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
    const response = await protectedApi.post('/Messaging/send', message)
    return response.data
  }
}
