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
import colors from 'tailwindcss/colors'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { EXPENSES } from '@/utils/query-keys'
import { fetchMonthlyExpenses } from '@/queries/expense'
import { formatIndianMoneyNotation } from '@/utils/format-money'

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  const { preferences } = useUserPreferences()
  if (active && payload && payload.length) {
    return (
      <div className='border bg-white p-1'>
        <p className='m-1'>{label}</p>
        <p className='m-1 text-orange-500'>{`${payload[0].name} : ${preferences.currencyUnit} ${payload[0].value}`}</p>
        <p className='m-1 text-blue-500'>{`${payload[2].name} : ${preferences.currencyUnit} ${payload[2].value}`}</p>
      </div>
    )
  }

  return null
}

export const SpentBalanceChart = () => {
  const { data, isLoading } = useQuery([EXPENSES.MONTHLY_EXPENSES], fetchMonthlyExpenses)

  const { preferences } = useUserPreferences()

  const monthlyData = useMemo(() => {
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
      <h3 className='text-lg text-center'>Monthly</h3>

      <ResponsiveContainer width='100%' aspect={2}>
        <ComposedChart
          data={monthlyData}
          margin={{
            top: 20,
            right: 20,
            bottom: 25,
            left: 20,
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
          <Bar dataKey='spent' barSize={150} fill={colors.orange['500']} />
          <Line type='monotone' dataKey='spent' stroke={colors.orange['500']} strokeWidth={2} />
          <Bar dataKey='balance' barSize={150} fill={colors.blue['500']} />
          <Line type='monotone' dataKey='balance' stroke={colors.blue['500']} strokeWidth={2} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
