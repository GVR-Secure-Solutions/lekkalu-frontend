import z from 'zod'

export const signupSchema = z.object({
  username: z
    .string({ required_error: 'Username is required!' })
    .min(6, 'Enter at least 6 characters!')
    .max(20, 'Enter at most 30 characters!'),
  email: z.string({ required_error: 'Email is required!' }).email('Invalid Email!'),
  password: z
    .string({ required_error: 'Password is required!' })
    .min(8, 'Enter at least 8 characters!')
    .max(20, 'Enter at most 30 characters!'),
  termsAndConditions: z.boolean({ required_error: 'Please accept our terms and conditions!' }),
  privacyPolicy: z.boolean({ required_error: 'Please agree to the privacy policies!' }),
})
export type SignupSchema = z.infer<typeof signupSchema>

export const loginSchema = z.object({
  username: z
    .string({ required_error: 'Username is required!' })
    .min(6, 'Enter at least 6 characters!')
    .max(20, 'Enter at most 30 characters!'),
  password: z.string({ required_error: 'Password is required!' }),
  rememberMe: z.boolean().optional(),
})
export type LoginSchema = z.infer<typeof loginSchema>

export const emailVerifyPayloadType = z.object({
  email: z.string({ required_error: 'Email is required!' }).email('Invalid Email!'),
})
export type EmailVerifyPayloadType = z.infer<typeof emailVerifyPayloadType>
