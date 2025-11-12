import { sessionOptions } from '../auth/queries'
import type { ExpenseResponse } from './types'
import type { Expense } from './expenses.dto'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { protectedApi } from '@/server/protected-api'

export class ExpenseService {
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

  static getExpenses = async ({
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
    const response = await protectedApi.get<ExpenseResponse>(
      '/Expenses/getAllExpensess',
      {
        params: searchParams,
      },
    )
    return response.data
  }

  static createExpense = async (expense: Expense) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<Expense>('/Expenses/save', {
      ...expense,
      churchId,
    })
    return response.data
  }

  static updateExpense = async (expense: Expense & { id: string }) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.put<Expense>('/Expenses/update', {
      ...expense,
      churchId,
    })
    return response.data
  }
}
