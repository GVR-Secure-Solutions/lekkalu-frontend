import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchLiabilities, fetchPhysicalAssets } from '@/queries/balance-sheet'
import { BALANCE_SHEET, INCOME_STATEMENT } from '@/utils/query-keys'
import { fetchIncomeSources } from '@/queries/income-statement'

const useGetScenarioOptions = () => {
  const [isFetchingOptions, setIsFetchingOptions] = useState(true)

  const { data: assests, isFetched: hasAssetsOptionFetched } = useQuery([BALANCE_SHEET.ASSETS], fetchPhysicalAssets)
  const { data: liabilities, isFetched: hasLiabilitiesOptionFetched } = useQuery(
    [BALANCE_SHEET.LIABILITIES],
    fetchLiabilities,
  )
  const { data: income, isFetched: hasIncomeOptionFetched } = useQuery(
    [INCOME_STATEMENT.INCOME_STATEMENT],
    fetchIncomeSources,
  )

  useEffect(() => {
    if (hasAssetsOptionFetched && hasLiabilitiesOptionFetched && hasIncomeOptionFetched) {
      setIsFetchingOptions(false)
    }
  }, [hasAssetsOptionFetched, hasLiabilitiesOptionFetched, hasIncomeOptionFetched])

  return {
    isFetchingOptions,
    liabilities,
    assests,
    income,
  }
}

export { useGetScenarioOptions }
