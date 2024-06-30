import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { AssetsType, PhysicalAsset } from '@/types/balance-sheet'
import { SERVER_DATE_FORMAT } from './constants'
// assets components
import AddOrEditAssetsCash from '@/pages/BalanceSheet/components/Cash/AddOrEditAssetsCash'
import AddOrEditAssetsAccount from '@/pages/BalanceSheet/components/Account/AddOrEditAssetsAccount'
import AddOrEditAssetsMutualFund from '@/pages/BalanceSheet/components/MutualFund/AddOrEditAssetsMutualFund'
import AddOrEditAssetsGold from '@/pages/BalanceSheet/components/Gold/AddOrEditAssetsGold'
import AddOrEditAssetsRealEstate from '@/pages/BalanceSheet/components/RealEstate/AddOrEditAssetsRealEstate'
import AddOrEditAssetsPhysical from '@/pages/BalanceSheet/components/PhysicalAsset/AddOrEditAssetsPhysical'

dayjs.extend(customParseFormat)

export const ASSET_MONTHS = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  label: index + 1,
}))

export const ASSET_YEARS = Array.from({ length: 41 }, (_, index) => ({
  id: index.toString(),
  label: index,
}))

export const ASSET_CATEGORY_TYPE: { label: string; id: AssetsType }[] = [
  {
    label: 'Cash',
    id: 'cash',
  },
  {
    label: 'Account',
    id: 'account',
  },
  {
    label: 'Mutual Funds / Equity',
    id: 'mutual_funds',
  },
  // {
  //   label: 'Gold',
  //   id: 'gold',
  // },
  // {
  //   label: 'Real Estate Property',
  //   id: 'real_estate',
  // },
  {
    label: 'Physical Assets',
    id: 'physical_assets',
  },
]

export const ASSET_INPUTS: InputField[] = [
  {
    id: 'name',
    label: 'Asset name',
    type: 'text',
  },
  {
    id: 'purchase_value',
    label: 'Purchase value',
    type: 'number',
  },
  {
    id: 'purchase_date',
    label: 'Choose the purchase date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'sell_value',
    label: 'Sell value(Optional)',
    type: 'number',
  },
  {
    id: 'sell_date',
    label: 'Choose the sell date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'depreciation_percent',
    label: 'Choose depreciation %',
    type: 'number',
  },
  {
    id: 'init_dep',
    label: 'Initial depreciation',
    type: 'number',
  },
  {
    id: 'market_value',
    label: 'Market Value',
    type: 'number',
  },
]

export const ASSET_INPUTS_FOR_SCENARIO: InputField[] = [
  {
    id: 'name',
    label: 'Asset name',
    type: 'text',
  },
  {
    id: 'purchase_value',
    label: 'Purchase value',
    type: 'number',
  },
  {
    id: 'purchase_date',
    label: 'Choose the purchase date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'depreciation_percent',
    label: 'Expected return',
    type: 'number',
  },
]

export const ASSET_INPUTS_FOR_SCENARIO_ADVANCE: InputField[] = [
  {
    id: 'sell_value',
    label: 'Sell value(Optional)',
    type: 'number',
  },
  {
    id: 'sell_date',
    label: 'Choose the sell date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'init_dep',
    label: 'Initial depreciation',
    type: 'number',
  },
  {
    id: 'market_value',
    label: 'Market Value',
    type: 'number',
  },
]

export const LIABILITY_INPUTS: InputField[] = [
  {
    id: 'name',
    label: 'Liability Name',
    type: 'text',
  },
  {
    id: 'balance',
    label: 'Balance',
    type: 'number',
  },
  {
    id: 'principal',
    label: 'Principal',
    type: 'number',
  },
  {
    id: 'disbursement_date',
    label: 'Disbursement Date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'emi_day',
    label: 'EMI Day',
    type: 'number',
  },
  {
    id: 'emi',
    label: 'EMI',
    type: 'number',
  },
  {
    id: 'tenure',
    label: 'Tenure',
    type: 'number',
  },
  {
    id: 'interest_rate',
    label: 'Interest Rate',
    type: 'number',
  },
  {
    id: 'closure_charges',
    label: 'Closure Charges',
    type: 'number',
  },
]

export const LIABILITY_INPUTS_FOR_SCENARIO: InputField[] = [
  {
    id: 'name',
    label: 'Loan Name',
    type: 'text',
  },
  {
    id: 'principal',
    label: 'Principal',
    type: 'number',
  },
  {
    id: 'disbursement_date',
    label: 'Disbursement Date',
    type: 'date',
    defaultDate: undefined,
  },
  {
    id: 'interest_rate',
    label: 'Interest',
    type: 'number',
  },
  {
    id: 'tenure',
    label: 'Tenure',
    type: 'number',
    helpText: 'No. of months',
  },
]

export const LIABILITY_INPUTS_FOR_SCENARIO_ADVANCE: InputField[] = [
  {
    id: 'balance',
    label: 'Balance',
    type: 'number',
  },
  {
    id: 'emi_day',
    label: 'EMI Day',
    type: 'number',
  },
  {
    id: 'emi',
    label: 'EMI',
    type: 'number',
  },
  {
    id: 'closure_charges',
    label: 'Closure Charges',
    type: 'number',
  },
]

function calculateUsefulLife(purchaseDate: dayjs.Dayjs, sellDate: dayjs.Dayjs) {
  const totalDaysInService = sellDate.diff(purchaseDate, 'day')

  // Approximation: 365.25 days per year to account for leap years
  const usefulLifeInYears = totalDaysInService / 365.25

  return {
    years: usefulLifeInYears,
    days: totalDaysInService,
  }
}

export const calculateDeprecationData = (assets: PhysicalAsset[]) => {
  const depreciationData: Array<{ date: string; value: number }> = []

  for (const asset of assets) {
    const costOfAsset = parseFloat(asset.purchase_value)
    const salvageValue = parseFloat(asset.sell_value ?? 0)
    const purchaseDate = dayjs(asset.purchase_date, SERVER_DATE_FORMAT)
    const sellDate = dayjs(asset.sell_date, SERVER_DATE_FORMAT)
    const { years: usefulLifeInYears } = calculateUsefulLife(purchaseDate, sellDate)

    const depreciationExpense = (costOfAsset - salvageValue) / usefulLifeInYears

    depreciationData.push({
      date: purchaseDate.format(SERVER_DATE_FORMAT),
      value: depreciationExpense,
    })
  }

  return depreciationData
}

export const getAppropriateAssetsTypeDialog = (type: AssetsType) => {
  let AddOrEditAssetDialogType: any
  switch (type) {
    case 'cash':
      AddOrEditAssetDialogType = AddOrEditAssetsCash
      break

    case 'account':
      AddOrEditAssetDialogType = AddOrEditAssetsAccount
      break

    case 'mutual_funds':
      AddOrEditAssetDialogType = AddOrEditAssetsMutualFund
      break

    case 'gold':
      AddOrEditAssetDialogType = AddOrEditAssetsGold
      break

    case 'real_estate':
      AddOrEditAssetDialogType = AddOrEditAssetsRealEstate
      break

    case 'physical_assets':
      AddOrEditAssetDialogType = AddOrEditAssetsPhysical
      break

    default:
      AddOrEditAssetDialogType = AddOrEditAssetsCash
      break
  }

  return AddOrEditAssetDialogType
}
