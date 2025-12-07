import { sessionOptions } from '../auth/queries'
import type { GenerateReport } from './types'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class ReportsService {
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

  static generateReport = async (report: Omit<GenerateReport, 'churchId'>) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post(
      '/reports/generate',
      {
        ...report,
        churchId: Number(churchId),
      },
      {
        responseType: 'blob',
      },
    )
    return response.data as Blob
  }
}
