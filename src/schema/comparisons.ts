import z from 'zod'

export const addComparisonSchema = z.object({
  name: z.string(),
  access: z.enum(['Private', 'Public']),
  scenarios: z.array(z.number()),
})

export type AddComaprisonSchema = z.infer<typeof addComparisonSchema>
