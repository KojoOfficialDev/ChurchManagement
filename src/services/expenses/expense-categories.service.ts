import { sessionOptions } from '../auth/queries'
import type { ExpenseCategory } from './expenses.dto'
import { protectedApi } from '@/server/protected-api'
import { getContext } from '@/integrations/tanstack-query/root-provider'

export class ExpenseCategoryService {
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

  static getExpenseCategories = async () => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.get<
      Array<ExpenseCategory & { id: string }>
    >('/ExpensesCategory/GetAll', {
      params: { id: churchId },
    })
    return response.data
  }

  static createExpenseCategory = async (expenseCategory: ExpenseCategory) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.post<ExpenseCategory>(
      '/ExpensesCategory/save',
      {
        ...expenseCategory,
        churchId,
      },
    )
    return response.data
  }

  static updateExpenseCategory = async (
    expenseCategory: ExpenseCategory & { id: string },
  ) => {
    const churchId = await this.getChurchId()
    const response = await protectedApi.put<ExpenseCategory>(
      '/ExpensesCategory/update',
      {
        ...expenseCategory,
        churchId,
      },
    )
    return response.data
  }
}
