import z from 'zod'

export const addScenarioSchemas = z.object({
  name: z.string(),
})

export type AddScenarioSchemas = z.infer<typeof addScenarioSchemas>
