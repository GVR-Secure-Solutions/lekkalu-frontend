import dayjs from 'dayjs'
import z from 'zod'

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'number') {
      return { message: 'Required' }
    }
  }
  return { message: ctx.defaultError }
}

export const addGoalSchema = z.object({
  name: z.string(),
  target_value: z.number(),
  target_contribution_source: z.coerce.number({ errorMap: customErrorMap }).optional().nullable(),
  track_kpi: z.string(),
  target_date: z.string().transform((value) => dayjs(value).format('YYYY-MM-DD')),
  goal_proportionality: z.string(),
})

export type AddGoalSchema = z.infer<typeof addGoalSchema>
