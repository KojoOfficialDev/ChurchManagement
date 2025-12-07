import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod/v3'

export const createUserSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .min(1, 'Email is required'),
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => {
        return isValidPhoneNumber(val)
      },
      {
        message: 'Invalid phone number',
      },
    ),
  active: z.boolean().default(true),
  accessRole: z.string().min(1, 'Access role is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
})

export const updateUserSchema = createUserSchema.extend({
  id: z.string().min(1, 'ID is required'),
  password: z.string().optional(),
})

export type CreateUser = z.infer<typeof createUserSchema>

export type UpdateUser = z.infer<typeof updateUserSchema>
