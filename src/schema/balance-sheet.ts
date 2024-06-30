import { z } from 'zod'
import { AssetsType } from '@/types/balance-sheet'

export const addPhysicalAssetSchemaOld = z.object({
  name: z.string().min(1, 'Asset name is required!'),
  purchase_value: z.coerce.number().min(1, 'Purchase value is required!'),
  purchase_date: z.date(),
  sell_value: z.coerce.number().optional(),
  sell_date: z.date().optional(),
  depreciation_percent: z.coerce.number().min(1, 'Depreciation % is required!'),
  init_dep: z.coerce.number({ required_error: 'Initial depreciation is required!' }),
  market_value: z.coerce.number().optional(),
  type: z.coerce.number(),
  tags: z.array(z.string()),
  months: z.coerce.number(),
  years: z.coerce.number(),
  user: z.number(),
})
export const addPhysicalAssetTypeSchema = z.object({
  type: z.string(),
})

export type AddPhysicalAssetTypeSchema = {
  type: AssetsType
}

// export type AddPhysicalAssetSchema = Omit<z.infer<typeof addPhysicalAssetSchema>, 'purchase_date' | 'sell_date'> & {
//   purchase_date: string
//   sell_date: string
//   depreciation_frequency: number
// }

export const addPhysicalAssetSchemaForScenario = z.object({
  name: z.string().min(1, 'Asset name is required!'),
  purchase_value: z.coerce.number().min(1, 'Purchase value is required!'),
  purchase_date: z.date(),
  sell_value: z.coerce.number().optional(),
  sell_date: z.date().optional(),
  depreciation_percent: z.coerce.number().min(1, 'Depreciation % is required!'),
  init_dep: z.coerce.number({ required_error: 'Initial depreciation is required!' }),
  market_value: z.coerce.number().optional(),
  type: z.coerce.number(),
  tags: z.array(z.string()),
  // months: z.coerce.number(),
  // years: z.coerce.number(),
  user: z.number(),
})

export type AddPhysicalAssetSchemaForScenario = Omit<
  z.infer<typeof addPhysicalAssetSchemaForScenario>,
  'purchase_date' | 'sell_date'
> & {
  purchase_date: string
  sell_date: string
}

export const addLiabilitySchema = z.object({
  name: z.string({ required_error: 'Name is required!' }),
  balance: z.coerce.number({ required_error: 'Balance is required!' }),
  principal: z.coerce.number({ required_error: 'Principal is required!' }),
  disbursement_date: z.date({ required_error: 'Disbursement Date is required!' }),
  emi_day: z.coerce.number({ required_error: 'Emi day is required!' }).min(1).max(30),
  emi: z.coerce.number().optional(),
  tenure: z.coerce.number({ required_error: 'Tenure is required!' }),
  interest_rate: z.coerce.number({ required_error: 'Interest Rage is required!' }),
  closure_charges: z.coerce.number({ required_error: 'Closure Charges is required!' }),
})

// ** Assets Schemas

// ** Cash
export const addCashSchema = z.object({
  balance: z.number({ required_error: 'Amount is required!', invalid_type_error: 'Amount should be number' }),
  name: z.string({ required_error: 'Name is required!' }),
})

// ** Account
export const addAccountSchema = z.object({
  balance: z.number({ required_error: 'Balance is required!' }),
  name: z.string().min(1, 'Account name is required!').trim(),
  // rate_return: z.number({ required_error: 'Rate return is required!' }),
})

// ** Account Transaction
export const addAccountTransactionSchema = z.object({
  amount: z.number({ required_error: 'Amount is required!' }),
  account: z.string().min(1, 'Account name is required!').trim(),
  time: z.string({ required_error: 'Date is required!' }),
})

// ** Mutual Fund
export const addMutualFundSchema = z.object({
  invested_amount: z.number({
    required_error: 'Invested amount is required!',
    invalid_type_error: 'Invested amount should be number',
  }),
  // expected_return: z.number({
  //   required_error: 'Expected return is required!',
  //   invalid_type_error: 'Expected return should be number',
  // }),
  purchase_date: z.date({ required_error: 'Date is required!' }),
  name: z.string({ required_error: 'Name is required!' }),
  quantity: z.number({ required_error: 'Quantity is required!', invalid_type_error: 'Quantity should be number' }),
})

// ** Gold
export const addGoldSchema = z.object({
  weight: z.number({ required_error: 'Weight is required!', invalid_type_error: 'Weight should be number' }),
})

// ** Real Estate
export const addRealEstateSchema = z.object({
  area: z.number({ required_error: 'Area is required!', invalid_type_error: 'Area should be number' }),
})

// ** Physical
export const addPhysicalAssetSchema = z.object({
  name: z.string({ required_error: 'Name is required!' }),
  purchase_value: z.number({
    required_error: 'Purchase value is required!',
    invalid_type_error: 'Purchase value should be number',
  }),
  purchase_date: z.date({ required_error: 'Date is required!' }),
  percentage_value: z.number({
    required_error: 'Percentage is required!',
    invalid_type_error: 'Percentage should be number',
  }),
  type: z.string({ required_error: 'Type is required!' }),
})
