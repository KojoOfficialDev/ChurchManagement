import { protectedApi } from '@/server/protected-api'
import { sessionOptions } from '../auth/queries'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import type { DashboardStatCounts, ChartData } from './types'

export class AnalyticsService {
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
  static getDashboardStatCounts = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<Array<DashboardStatCounts>>(
      '/dashboard/statcards',
      {
        params: {
          id: churchId,
        },
      },
    )
    return response.data
  }

  static getChartData = async ({
    year,
  }: {
    year: number
  }): Promise<ChartData[]> => {
    const churchId = await this.getChurchId()

    const response = await protectedApi.get<{
      data: ChartData[]
    }>('/dashboard/monthlyContributions', {
      params: { id: churchId, year },
    })
    return response.data.data
  }
}
