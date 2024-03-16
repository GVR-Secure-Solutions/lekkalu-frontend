import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Chart from 'react-apexcharts'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchLiabilities } from '@/queries/balance-sheet'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { useUserPreferences } from '@/hooks/use-user-preferences'

export default function LiabilityBarGraph() {
  const { data, isLoading } = useQuery([BALANCE_SHEET.LIABILITIES], fetchLiabilities)
  const { preferences } = useUserPreferences()
  const liabilitiesData = useMemo(() => {
    if (!data) {
      return []
    }

    return data.map((liability) => ({
      ...liability,
      balance: parseFloat(liability.balance),
    }))
  }, [data])

  if (isLoading) {
    return <div className='w-full h-96 bg-gray-200 animate-pulse' />
  }

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
      foreColor: '#000',
      toolbar: {
        show: true,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: liabilitiesData.map((item) => item.name),
    },
    yaxis: {
      labels: {
        formatter: (value) => `${preferences.currencyUnit} ${formatIndianMoneyNotation(value, 1)}`,
      },
    },
  }
  const chartSeries: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: 'Balance',
      type: 'bar',
      data: liabilitiesData.map((item) => item.balance),
    },
  ]

  return <Chart options={chartOptions} series={chartSeries} type='bar' height={320} />
}
