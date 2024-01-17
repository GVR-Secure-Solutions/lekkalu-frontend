import React, { useMemo } from 'react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { round } from 'lodash'
import colors from 'tailwindcss/colors'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { EXPENSES } from '@/utils/query-keys'
import { fetchWeeklyExpenses } from '@/queries/expense'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export const WeeklyChart = () => {
  const { preferences } = useUserPreferences()
  const { data, isLoading } = useQuery([EXPENSES.WEEKLY_EXPENSES], fetchWeeklyExpenses)

  const weeklyData = useMemo(() => {
    if (!data) {
      return []
    }

    return data.map((expense) => {
      if (data.length >= 4) {
        return {
          time: `${expense.week} ${expense.year}`,
          amount: expense?.total_amount,
          roll_avg: round(expense.total_amount / 5, 2),
        }
      }

      return {
        time: `${expense.week} ${expense.year}`,
        amount: expense.total_amount,
      }
    })
  }, [data])

  if (isLoading) {
    return <div className='w-full animate-pulse bg-gray-300 h-96' />
  }

  return (
    <div className='border p-4 w-full'>
      <h3 className='text-lg text-center'>Weekly Spend Analysis</h3>

      <ResponsiveContainer width='100%' aspect={2}>
        <LineChart data={weeklyData} margin={{ top: 5, right: 0, bottom: 25, left: 25 }}>
          <Tooltip />
          <XAxis
            dataKey='time'
            dy={5}
            label={{
              value: 'Week Year',
              position: 'center',
              dy: 28,
            }}
          />
          <YAxis
            tickFormatter={(tick) => {
              return `${preferences.currencyUnit} ${formatIndianMoneyNotation(tick, 0)}`
            }}
          />
          <CartesianGrid strokeDasharray='0 0' />
          <Legend layout='horizontal' verticalAlign='top' align='center' />
          <Line type='monotone' dataKey='amount' stroke={colors.blue['500']} strokeWidth={2} name='Weekly Spend' />
          <Line type='monotone' dataKey='roll_avg' stroke={colors.orange['500']} strokeWidth={2} name='Roll Avg(5)' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
