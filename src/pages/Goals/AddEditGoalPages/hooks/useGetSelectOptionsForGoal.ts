import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchUserCustomKPIs, fetchGoalProportionalityTypes, fetchKPITypes, fetchCustomKPIs } from '@/queries/goals'
import { fetchIncomeExpenses } from '@/queries/income-statement'
import { BALANCE_SHEET, CUSTOM_KPIS, GOALS, USER_CUSTOM_KPIS } from '@/utils/query-keys'

const useGetSelectOptionsForGoal = () => {
  const [isFetchingOptions, setIsFetchingOptions] = useState(true)
  const { data: incomeExpenses, isFetched: hasFetchedIncomeExpenses } = useQuery({
    queryKey: [BALANCE_SHEET.INCOME_EXPENSES],
    queryFn: fetchIncomeExpenses,
  })
  const { data: user_custom_kpis, isFetched: hasFetchedUserCustomKpis } = useQuery({
    queryKey: [USER_CUSTOM_KPIS.KPIS],
    queryFn: fetchUserCustomKPIs,
  })
  const { data: custom_kpis, isFetched: hasFetchedCustomKpis } = useQuery({
    queryKey: [CUSTOM_KPIS.KPIS],
    queryFn: fetchCustomKPIs,
  })
  const { data: goalProportionality, isFetched: hasFetchedGoalProportionality } = useQuery({
    queryKey: [GOALS.GOAL_PROPORTIONALITY_TYPES],
    queryFn: fetchGoalProportionalityTypes,
  })
  const { data: getTargetKpi, isFetched: hasFetchedTargetKpi } = useQuery({
    queryKey: [GOALS.KPI_TYPES],
    queryFn: fetchKPITypes,
  })

  useEffect(() => {
    if (hasFetchedCustomKpis && hasFetchedUserCustomKpis && hasFetchedIncomeExpenses && hasFetchedGoalProportionality && hasFetchedTargetKpi) {
      setIsFetchingOptions(false)
    } else {
      setIsFetchingOptions(true)
    }
  }, [hasFetchedCustomKpis, hasFetchedUserCustomKpis, hasFetchedGoalProportionality, hasFetchedIncomeExpenses, hasFetchedTargetKpi])

  const totalExpenses = incomeExpenses?.reduce((acc, curr) => (acc += Number(curr.amount)), 0)

  return {
    custom_kpis,
    user_custom_kpis,
    incomeExpenses,
    goalProportionality,
    getTargetKpi,
    isFetchingOptions,
    totalExpenses,
  }
}

export default useGetSelectOptionsForGoal
