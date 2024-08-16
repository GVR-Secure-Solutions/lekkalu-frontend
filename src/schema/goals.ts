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

export const addGoalSchema = z
  .object({
    name: z.string(),
    target_value: z.number(),
    target_contribution_source: z.coerce.number({ errorMap: customErrorMap }).optional().nullable(),
    track_kpi: z.string().optional().nullable(),
    target_date: z.string().transform((value) => dayjs(value).format('YYYY-MM-DD')),
    goal_proportionality: z.string(),
    custom_kpi: z.coerce.number({ errorMap: customErrorMap }).optional().nullable(),
  })
  .refine(
    (data) => {
      return (data.custom_kpi && !data.track_kpi) || (!data.custom_kpi && data.track_kpi)
    },
    {
      message: 'Please Select either Custom KPI or Existing Track KPI',
      path: ['track_kpi', 'custom_kpi'],
    },
  )

export type AddGoalSchema = z.infer<typeof addGoalSchema>
