import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import colors from 'tailwindcss/colors'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { fetchMonthlyExpenses } from '@/queries/expense'
import { EXPENSES } from '@/utils/query-keys'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export const CumSumChart = () => {
  const { data, isLoading } = useQuery([EXPENSES.MONTHLY_EXPENSES], fetchMonthlyExpenses)

  const { preferences } = useUserPreferences()

  const cumSumData = useMemo(() => {
    if (!data) {
      return []
    }

    return data
      .map((monthlyExpense) => ({
        ...monthlyExpense,
        month: dayjs().month(monthlyExpense.month).format('MMMM'),
      }))
      .sort((a, b) => a.year + b.year)
  }, [data])

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: true,
      },
      foreColor: '#000',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 5,
        left: 1,
        blur: 5,
        opacity: 0.18,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    colors: [colors.green['500']],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '60%',
      },
    },
    xaxis: {
      categories: cumSumData.map((item) => item.month.slice(0, 3)),
      labels: {
        formatter: (value) => value,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => `${preferences.currencyUnit} ${formatIndianMoneyNotation(value, 1)}`,
      },
    },
  }
  const chartSeries: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: 'Cum Sum',
      data: cumSumData.map((item) => item.cum_sum),
    },
  ]
  if (isLoading) {
    return <div className='w-full animate-pulse bg-gray-300 h-96' />
  }

  return (
    <div className='border p-4 w-full'>
      <h3 className='text-lg text-center'>Cumulative Surplus Deficit</h3>
      <Chart options={chartOptions} series={chartSeries} type='bar' height={320} />
    </div>
  )
}
