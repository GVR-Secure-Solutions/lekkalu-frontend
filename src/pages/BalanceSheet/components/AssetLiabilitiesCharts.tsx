import React, { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import Chart from 'react-apexcharts'
import { round } from 'lodash'
import { cn } from '@/utils/utils'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchLiabilities, fetchPhysicalAssets } from '@/queries/balance-sheet'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type Props = {
  className?: string
  style?: React.CSSProperties
}

export default function AssetLiabilitiesChart({ className, style }: Props) {
  const { preferences } = useUserPreferences()

  const [physicalAssetsQ, liabilitiesQ] = useQueries({
    queries: [
      {
        queryKey: [BALANCE_SHEET.ASSETS],
        queryFn: fetchPhysicalAssets,
      },
      {
        queryKey: [BALANCE_SHEET.LIABILITIES],
        queryFn: fetchLiabilities,
      },
    ],
  })

  const chartData = useMemo(() => {
    if (!physicalAssetsQ.data || !liabilitiesQ.data) {
      return { assetsData: [], liabilitiesData: [] }
    }

    const totalAssetValue = physicalAssetsQ.data.reduce((acc, curr) => (acc += parseFloat(curr.market_value)), 0)
    const assetsData = physicalAssetsQ.data
      .map((asset) => {
        const assetValue = parseFloat(asset.market_value)
        return { ...asset, value: assetValue, percentage: round((assetValue * 100) / totalAssetValue, 2) }
      })
      .sort((a, b) => b.percentage - a.percentage)

    const totalLiabilitiesValue = liabilitiesQ.data.reduce((acc, curr) => (acc += parseFloat(curr.balance)), 0)
    const liabilitiesData = liabilitiesQ.data
      .map((liability) => {
        const liabilityValue = parseFloat(liability.balance)
        return {
          ...liability,
          value: parseFloat(liability.balance),
          percentage: round((liabilityValue * 100) / totalLiabilitiesValue, 2),
        }
      })
      .sort((a, b) => b.percentage - a.percentage)

    return { assetsData, liabilitiesData }
  }, [liabilitiesQ.data, physicalAssetsQ.data])

  if (physicalAssetsQ.isLoading || liabilitiesQ.isLoading) {
    return (
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='h-96 w-full bg-gray-200 animate-pulse' />
        <div className='h-96 w-full bg-gray-200 animate-pulse' />
        <div />
      </div>
    )
  }

  const chartOptionsAssets: ApexCharts.ApexOptions = {
    chart: {
      width: 450,
      type: 'donut',
    },
    labels: chartData.assetsData?.map((ele) => `${ele.name} ${ele.percentage}%`),
    legend: {
      position: 'bottom',
      fontSize: '16px',
    },
    fill: {
      type: 'gradient',
    },
    tooltip: {
      y: {
        formatter: (value) => `${preferences.currencyUnit} ${formatIndianMoneyNotation(value)}`,
      },
    },
  }
  const chartSeriesLent: ApexAxisChartSeries | ApexNonAxisChartSeries = chartData.assetsData?.map((ele) => ele.value)

  const chartOptionsLiabilities: ApexCharts.ApexOptions = {
    chart: {
      width: 400,
      type: 'donut',
    },
    fill: {
      type: 'gradient',
    },
    labels: chartData.liabilitiesData?.map((ele) => `${ele.name} ${ele.percentage}%`),
    legend: {
      position: 'bottom',
      fontSize: '16px',
    },
    tooltip: {
      y: {
        formatter: (value) => `${preferences.currencyUnit} ${formatIndianMoneyNotation(value)}`,
      },
    },
  }
  const chartSeriesLiabilities: ApexAxisChartSeries | ApexNonAxisChartSeries = chartData.liabilitiesData?.map(
    (ele) => ele.value,
  )

  return (
    <div className={cn('flex items-center justify-center flex-col md:flex-row gap-4 w-full', className)} style={style}>
      <div className='w-full flex items-center justify-center flex-col'>
        <div className='text-center'>Assets</div>
        <Chart options={chartOptionsAssets} series={chartSeriesLent} type='donut' width={400} height={400} />
      </div>
      <div className='w-full flex items-center justify-center flex-col'>
        <div className='text-center'>Liabilities</div>
        <Chart
          options={chartOptionsLiabilities}
          series={chartSeriesLiabilities}
          type='donut'
          width={400}
          height={400}
        />
      </div>
    </div>
  )
}
