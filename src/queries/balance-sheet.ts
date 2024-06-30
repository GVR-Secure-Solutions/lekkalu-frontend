import {
  AddPhysicalAssetSchema,
  AddCashType,
  CashAssets,
  Liability,
  LoanTransaction,
  MutualFunds,
  PhysicalAsset,
  MutualFundSchema,
  AddLiabilitySchema,
  SecurityTransactionSchema,
  AssetsPropertiesType,
  AddAssetsPropertiesType,
  AccountSchema,
  AddAccountSchema,
  AddAccountTransactionSchema,
  AccountTransactionSchema,
} from '@/types/balance-sheet'
import { v1ApiClient, v2ApiClient } from '@/utils/client'

export async function fetchPhysicalAssets() {
  const { data } = await v1ApiClient.get<PhysicalAsset[]>('physical_assets/')
  return data
}

export async function fetchPhysicalAssetsById(id: number) {
  const { data } = await v1ApiClient.get<PhysicalAsset[]>(`physical_assets/${id}/`)
  return data
}

export async function deletePhysicalAsset(id: number) {
  const { data } = await v1ApiClient.delete<{ message: string }>(`/physical_assets/${id}`)
  return data
}

export async function addPhysicalAsset(dto: AddPhysicalAssetSchema) {
  const { data } = await v1ApiClient.post<PhysicalAsset[]>('/physical_assets/', dto)
  return data
}

export async function editPhysicalAsset(id: number, dto: Partial<AddPhysicalAssetSchema>) {
  const { data } = await v1ApiClient.put(`physical_assets/${id}`, dto)
  return data
}

// ** Liabilities
export async function fetchLiabilities() {
  const { data } = await v1ApiClient.get<Liability[]>('loans/')
  return data
}

export async function addLiability(dto: AddLiabilitySchema) {
  const { data } = await v1ApiClient.post('loans/', dto)
  return data
}

export async function editLiability(id: number, dto: Partial<AddLiabilitySchema>) {
  const { data } = await v1ApiClient.put(`loans/${id}`, dto)
  return data
}

export async function deleteLiability(id: number) {
  const { data } = await v1ApiClient.delete(`loans/${id}`)
  return data
}

// ** Loan Transactions
export async function fetchLoanTransactions() {
  const { data } = await v1ApiClient.get<LoanTransaction[]>('loan_transactions/')
  return data
}

export async function fetchTransactionsForLoan(loan_id: number) {
  const { data } = await v1ApiClient.get<LoanTransaction[]>('loan_transactions', { params: { loan_id } })
  return data
}

// ** Account Assets
export async function fetchAccountAssets() {
  const { data } = await v1ApiClient.get<AccountSchema[]>('accounts/')
  return data
}

export async function addAccountAsset(dto: AddAccountSchema) {
  const { data } = await v1ApiClient.post<AccountSchema[]>('accounts/', dto)
  return data
}

export async function deleteAccountAsset(id: number) {
  const { data } = await v1ApiClient.delete<{ message: string }>(`/accounts/${id}`)
  return data
}

export async function editAccountAsset(id: string, dto: AddAccountSchema) {
  const { data } = await v1ApiClient.put(`accounts/${id}`, dto)
  return data
}

// ** Account Transactions Assets
export async function fetchAccountTransactionAssets() {
  const { data } = await v1ApiClient.get<AccountTransactionSchema[]>('account_transactions/')
  return data
}

export async function addAccountTransactionAsset(dto: AddAccountTransactionSchema) {
  const { data } = await v1ApiClient.post<AccountTransactionSchema[]>('account_transactions/', dto)
  return data
}

export async function deleteAccountTransactionAsset(id: number) {
  const { data } = await v1ApiClient.delete<{ message: string }>(`/account_transactions/${id}`)
  return data
}

export async function editAccountTransactionAsset(id: string, dto: AddAccountTransactionSchema) {
  const { data } = await v1ApiClient.put(`account_transactions/${id}`, dto)
  return data
}

// ** Assets Properties
export async function fetchAssetsPropertiesById(id: number) {
  const { data } = await v1ApiClient.get<AssetsPropertiesType>(`/asset_properties/${id}`)
  return data
}
export async function editAssetsPropertiesById(id: number, dto: Partial<AddAssetsPropertiesType>) {
  const { data } = await v1ApiClient.put(`asset_properties/${id}`, dto)
  return data
}

// ** Mutual Fund
export async function fetchMutualFunds() {
  const { data } = await v1ApiClient.get<MutualFunds[]>('mutual_funds/')
  return data
}

export async function addMutualFund(dto: MutualFundSchema) {
  const { data } = await v1ApiClient.post<MutualFunds>('/mutual_funds', dto)
  return data
}

export async function editMutualFund(id: number, dto: Partial<MutualFunds>) {
  const { data } = await v1ApiClient.put(`mutual_funds/${id}`, dto)
  return data
}

export async function deleteMutualFund(id: number) {
  const { data } = await v1ApiClient.delete<{ message: string }>(`/mutual_funds/${id}`)
  return data
}

// ** Security Transactions
export async function fetchSecurityTransaction() {
  const { data } = await v1ApiClient.get<SecurityTransactionSchema[]>('securities_transaction/')
  return data
}
export async function addSecurityTransaction(dto: SecurityTransactionSchema) {
  const { data } = await v1ApiClient.post<MutualFunds>('securities_transaction/', dto)
  return data
}
export async function editSecurityTransaction(id: number, dto: SecurityTransactionSchema) {
  const { data } = await v1ApiClient.put(`securities_transaction/${id}`, dto)
  return data
}

export async function deleteSecurityTransaction(id: number) {
  const { data } = await v1ApiClient.delete<{ message: string }>(`/securities_transaction/${id}`)
  return data
}

// ** Cash Assets
export async function addCashAsset(dto: AddCashType) {
  const { data } = await v2ApiClient.post<CashAssets>('/cash', dto)
  return data
}
export async function editCashAsset(id: number, dto: Partial<AddCashType>) {
  const { data } = await v2ApiClient.put(`cash/${id}`, dto)
  return data
}

export async function fetchCashAsset() {
  const { data } = await v2ApiClient.get<AddCashType[]>('/cash')
  return data
}

export async function deleteCashAsset(id: number) {
  const { data } = await v2ApiClient.delete<{ message: string }>(`/cash/${id}`)
  return data
}
