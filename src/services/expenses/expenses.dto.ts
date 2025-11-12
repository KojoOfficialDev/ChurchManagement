// {
//   "isActive": true,
//   "name": "string",
//   "description": "string",
//   "expensesCategoryId": 0,
//   "amountSpent": 0.1,
//   "expenseDate": "2019-08-24T14:15:22Z",
//   "paymentMethod": "string",
//   "suppliersName": "string",

// }
import { z } from 'zod/v3'

export const expenseCategorySchema = z.object({
  isActive: z.boolean().default(true),
  name: z.string().min(1, 'Name is required'),
  active: z.boolean().default(true),
})

export const expenseSchema = z.object({
  isActive: z.boolean().default(true),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  expensesCategoryId: z.coerce
    .number()
    .min(1, 'Expenses category id is required'),
  amountSpent: z.number().min(0, 'Amount spent is required'),
  expenseDate: z.date({ required_error: 'Expense date is required' }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  suppliersName: z.string().nullable().optional(),
})

export const updateExpenseCategorySchema = expenseCategorySchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export const updateExpenseSchema = expenseSchema.and(
  z.object({
    id: z.string().min(1, 'ID is required'),
  }),
)

export type ExpenseCategory = z.infer<typeof expenseCategorySchema>
export type Expense = z.infer<typeof expenseSchema>
export type UpdateExpenseCategory = z.infer<typeof updateExpenseCategorySchema>
export type UpdateExpense = z.infer<typeof updateExpenseSchema>
