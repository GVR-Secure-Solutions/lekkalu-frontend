import z from 'zod'

export const sipCalculatorSchema = z.object({
  monthlyAmount: z.number().min(0).max(100_000),
  durationInvestment: z.number().min(0).max(40),
  rateReturn: z.number().min(0).max(30),
})

export const cagrCalculatorSchema = z.object({
  initialValue: z.coerce.number().min(0).max(100_000_00),
  finalValue: z.coerce.number().min(0).max(100_000_00),
  durationOfInvestment: z.coerce.number().min(0).max(40),
})

export const emiCalculatorSchema = z.object({
  loanPrincipal: z.coerce.number().min(0).max(10000000),
  loanInterest: z.coerce.number().min(0).max(100),
  loanTenure: z.coerce.number().min(0).max(240),
  disbursementDate: z.date(),
  emiDay: z.coerce.number().min(1).max(31),
})
