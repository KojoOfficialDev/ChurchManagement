import { z } from 'zod/v3'

export const loginSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address',
    })
    .min(1, 'email is required'),
  password: z.string().min(1, 'password is required'),
})

export const LoginPageSearch = z.object({
  redirect: z.string().optional(),
})

export type LoginSchema = z.infer<typeof loginSchema>
