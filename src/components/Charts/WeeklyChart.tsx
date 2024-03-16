import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'
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

    return data
      .map((expense) => {
        if (data.length >= 4) {
          return {
            time: `${expense.week} ${expense.year}`,
            amount: expense?.total_amount,
            roll_avg: round(expense.total_amount / 5, 2),
            date: convertTimeToDate(`${expense.week} ${expense.year}`),
          }
        }

        return {
          time: `${expense.week} ${expense.year}`,
          amount: expense.total_amount,
          date: convertTimeToDate(`${expense.week} ${expense.year}`),
        }
      })
      .sort((a, b) => (a.date?.getTime() as number) - (b.date?.getTime() as number))
  }, [data])

  if (isLoading) {
    return <div className='w-full animate-pulse bg-gray-300 h-96' />
  }
  function convertTimeToDate(timeString: string): Date {
    const [week, year] = timeString.split(' ') as any
    const startDate = new Date(Date.UTC(year, 0, 1))
    startDate.setDate(startDate.getDate() + (parseInt(week, 10) - 1) * 7)
    return startDate
  }

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: true,
      },
      zoom: {
        autoScaleYaxis: true,
      },
      foreColor: '#000',
    },
    stroke: {
      curve: 'smooth',
    },
    colors: [colors.blue['500'], colors.orange['500']],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: 'datetime',
      min: weeklyData[Math.floor(weeklyData.length / 4)].date.getTime(), // Set min to quarter of the data
      max: weeklyData[Math.floor((weeklyData.length * 3) / 4)].date.getTime(),
      categories: weeklyData.map((item) => item.date),
      labels: {
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm',
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy',
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
      name: 'Weekly Spend',
      data: weeklyData.map((item) => item.amount),
    },
    {
      name: 'Roll Avg(5)',
      data: weeklyData.map((item) => item.roll_avg || 0),
    },
  ]
  return (
    <div className='border p-4 w-full'>
      <h3 className='text-lg text-center'>Weekly Spend Analysis</h3>
      <Chart options={chartOptions} series={chartSeries} type='area' height={320} />
    </div>
  )
}
