import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'
import { calculateDeprecationData } from '@/utils/balance-sheet'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export default function AssetDepreciationChart() {
  const { data, isLoading } = useQuery([BALANCE_SHEET.ASSETS], fetchPhysicalAssets)
  const { preferences } = useUserPreferences()

  const depreciationData = useMemo(() => {
    if (!data) {
      return []
    }

    return calculateDeprecationData(data)
  }, [data])

  if (isLoading) {
    return <div className='w-full animate-pulse bg-gray-300 h-96' />
  }

  return (
    <div className='border p-4 w-full'>
      <h3 className='text-lg text-center'>Assets depreciation</h3>

      <ResponsiveContainer width='100%' aspect={2}>
        <LineChart data={depreciationData} margin={{ top: 5, right: 0, bottom: 25, left: 25 }}>
          <Tooltip />
          <XAxis
            dataKey='date'
            dy={5}
            label={{
              value: 'Depreciation',
              position: 'center',
              dy: 28,
            }}
          />
          <YAxis
            dataKey='value'
            tickFormatter={(tick) => {
              return `${preferences.currencyUnit} ${formatIndianMoneyNotation(tick, 0)}`
            }}
          />
          <Line dataKey='value' type='monotone' />

          <Legend layout='horizontal' verticalAlign='top' align='center' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
