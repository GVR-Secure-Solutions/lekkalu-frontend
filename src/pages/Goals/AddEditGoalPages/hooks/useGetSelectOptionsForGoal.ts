import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchGoalProportionalityTypes, fetchKPITypes } from '@/queries/goals'
import { fetchIncomeExpenses } from '@/queries/income-statement'
import { BALANCE_SHEET, GOALS } from '@/utils/query-keys'

const useGetSelectOptionsForGoal = () => {
  const [isFetchingOptions, setIsFetchingOptions] = useState(true)
  const { data: incomeExpenses, isFetched: hasFetchedIncomeExpenses } = useQuery({
    queryKey: [BALANCE_SHEET.INCOME_EXPENSES],
    queryFn: fetchIncomeExpenses,
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
    if (hasFetchedIncomeExpenses && hasFetchedGoalProportionality && hasFetchedTargetKpi) {
      setIsFetchingOptions(false)
    } else {
      setIsFetchingOptions(true)
    }
  }, [hasFetchedGoalProportionality, hasFetchedIncomeExpenses, hasFetchedTargetKpi])

  const totalExpenses = incomeExpenses?.reduce((acc, curr) => (acc += Number(curr.amount)), 0)

  return {
    incomeExpenses,
    goalProportionality,
    getTargetKpi,
    isFetchingOptions,
    totalExpenses,
  }
}

export default useGetSelectOptionsForGoal
