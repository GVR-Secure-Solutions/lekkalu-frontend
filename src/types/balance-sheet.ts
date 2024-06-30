import { z } from 'zod'
import { addLiabilitySchema } from '@/schema/balance-sheet'

export type PhysicalAsset = {
  id: number
  name: string
  purchase_value: string
  sell_value: string
  purchase_date: string
  sell_date: string
  depreciation_percent: string
  depreciation_percent_per_year: string
  init_dep: number | null
  depreciation_frequency: number
  market_value: string
  user: number
  type: number
  tags: []
}

export type Liability = {
  id: number
  balance: string
  closure_charges: string
  disbursement_date: string
  emi: string
  emi_day: string
  interest_rate: string
  name: string
  principal: string
  tenure: number
  user: number
}
export type AddLiabilitySchema = Omit<z.infer<typeof addLiabilitySchema>, 'disbursement_date'> & {
  disbursement_date: string
}
export type LoanTransaction = {
  id: number
  amount: number
  loan: number
  time: string
  type: number
  user: number
  user_remark: string
}

// ** Assets Types
export type AssetsType = 'cash' | 'account' | 'mutual_funds' | 'gold' | 'real_estate' | 'physical_assets'

// ** Cash
export type AddCashType = {
  name: string
  balance: number
  id?: number
}
export type CashAssets = {
  name: string
  balance: number
  id: number
}

// ** Account
export type AddAccountSchema = {
  name: string
  balance: number
  // rate_return: number
}
export type AccountSchema = {
  name: string
  balance: string
  id: string
}

// ** Account Transaction
export type AddAccountTransactionSchema = {
  account: string | number
  time: string | Date
  amount: number
  type?: number
}
export type AccountTransactionSchema = {
  account: string
  time: string
  amount: number
  id: string
  type: number
}

// ** Security Transaction
export type SecurityTransactionSchema = {
  id?: number
  type: string
  value: number
  quantity: number
  security_object_id: number
  transaction_date: string
  security_type: string
}

export type SecurityTransaction = {
  id: number
  type: string
  value: number
  quantity: number
  transaction_date: string
  security_type: number
  security_object_id: number
}

// ** Assets Properties
export type AssetsPropertiesType = {
  id?: number
  expected_rate_of_return: string
  sip_type: string
  sip_base: string
  sip_inc: string
  sip_day: number
  security_type: number
  security_object_id: number
}
export type AddAssetsPropertiesType = {
  expected_rate_of_return: string
  security_type: string
  security_object_id: number
}

// ** Mutual Fund
export type AddMutualFundType = {
  name: string
  invested_amount: number
  expected_return: number
  purchase_date: Date
  quantity: number
}
export type MutualFunds = {
  id: number
  name: string
  isin: string
  investment_type: string
  current_nav: string | null
}
export type MutualFundSchema = {
  id?: number
  type: string
  value: number
  quantity: number
  security_object_id: number
  transaction_date: string
  security_type: string
}

// ** Gold
export type AddGoldType = {
  weight: number
}

// ** Real Estate
export type AddRealEstateTypes = {
  id?: number
  pincode: number
  area: number
  land_name: string
}

// ** Physical
export type AddPhysicalAssetSchema = {
  name: string
  purchase_value: number
  purchase_date: string
  depreciation_percent_per_year: number
  type: number
}

export type AddPhysicalAssetTypeSchema = {
  type: AssetsType
}

export type AddPhysicalAssetType = {
  name: string
  purchase_value: number
  purchase_date: Date
  percentage_value: number
  type: 'depreciation' | 'apprecitaion'
  months?: number
  years?: number
}
