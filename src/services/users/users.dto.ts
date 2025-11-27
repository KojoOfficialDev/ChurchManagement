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
  churchId: z.number().min(1, 'Church id is required'),
  active: z.boolean().default(true),
  accessRole: z.string().min(1, 'Access role is required'),
})

export type CreateUser = z.infer<typeof createUserSchema>
