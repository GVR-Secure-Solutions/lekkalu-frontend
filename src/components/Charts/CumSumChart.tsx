import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  TooltipProps,
  ComposedChart,
  Line,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import colors from 'tailwindcss/colors'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { fetchMonthlyExpenses } from '@/queries/expense'
import { EXPENSES } from '@/utils/query-keys'
import { formatIndianMoneyNotation } from '@/utils/format-money'

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  const { preferences } = useUserPreferences()

  if (active && payload && payload.length) {
    return (
      <div className='border bg-white p-1'>
        <p className='m-1'>{label}</p>
        <p className='m-1 text-green-500 '>{`${payload[0].name} : ${preferences.currencyUnit} ${payload[0].value}`}</p>
      </div>
    )
  }

  return null
}

export const CumSumChart = () => {
  const { data, isLoading } = useQuery([EXPENSES.MONTHLY_EXPENSES], fetchMonthlyExpenses)

  const { preferences } = useUserPreferences()

  const cumSumData = useMemo(() => {
    if (!data) {
      return []
    }

    return data.map((monthlyExpense) => ({
      ...monthlyExpense,
      month: dayjs().month(monthlyExpense.month).format('MMMM'),
    }))
  }, [data])

  if (isLoading) {
    return <div className='w-full animate-pulse bg-gray-300 h-96' />
  }

  return (
    <div className='border p-4 w-full'>
      <h3 className='text-lg text-center'>Monthly Cum Sum</h3>

      <ResponsiveContainer width='100%' aspect={2}>
        <ComposedChart
          data={cumSumData}
          margin={{
            top: 20,
            right: 20,
            bottom: 25,
            left: 25,
          }}
        >
          <CartesianGrid strokeDasharray='0 0' vertical={false} />
          <XAxis dataKey='month' dy={10} />
          <YAxis
            tickFormatter={(tick) => {
              return `${preferences.currencyUnit} ${formatIndianMoneyNotation(tick, 0)}`
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout='horizontal'
            align='center'
            wrapperStyle={{
              position: 'relative',
            }}
          />
          <Bar dataKey='cum_sum' barSize={160} fill={colors.green['500']} />
          <Line type='monotone' dataKey='cum_sum' stroke={colors.green['500']} strokeWidth={3} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
