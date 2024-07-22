import z from 'zod'

export const incomeTypeSchema = z.object({
  id: z.number(),
  label: z.string(),
  value: z.string(),
})

export const addIncomeStatementSchema = z.object({
  name: z
    .string({ required_error: 'Name is required!' })
    .min(2, 'Please enter at least 4 characters!')
    .max(100, 'Please enter at most 100 characters!'),
  type: z.string({ required_error: 'Type is required!' }),
  amount: z.coerce.number({ required_error: 'Amount is required!' }),
})
export type AddIncomeStatementSchema = z.infer<typeof addIncomeStatementSchema>
