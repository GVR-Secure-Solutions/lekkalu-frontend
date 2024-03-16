import React, { useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import Chart from 'react-apexcharts'
import { cn } from '@/utils/utils'
import { LENDING } from '@/utils/query-keys'
import { fetchLendingAccounts, fetchLendingTransaction } from '@/queries/lending'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type Props = {
  className?: string
  style?: React.CSSProperties
}

export default function LentAndBorrowedChart({ className, style }: Props) {
  const [accounts, transactions] = useQueries({
    queries: [
      {
        queryKey: [LENDING.ACCOUNTS],
        queryFn: fetchLendingAccounts,
      },
      {
        queryKey: [LENDING.TRANSACTIONS],
        queryFn: fetchLendingTransaction,
      },
    ],
  })
  const { preferences } = useUserPreferences()

  // Inside your component
  const chartData = useMemo(() => {
    if (!accounts.data) {
      return { lentData: [], borrowedData: [] }
    }

    // Prepare data for the charts
    const lentData = accounts.data
      .filter((account) => parseFloat(String(account?.balance)) > 0)
      .map((ele) => {
        const item = {
          ...ele,
          value: Math.abs(parseFloat(String(ele?.balance))),
        }
        // Assert the type to include the 'percentage' property
        return item as typeof item & { percentage: string }
      })
      .slice()
      .sort((a, b) => b.value - a.value)
    const borrowedData = accounts.data
      .filter((account) => parseFloat(String(account?.balance)) < 0)
      .map((ele) => {
        const item = {
          ...ele,
          value: Math.abs(parseFloat(String(ele?.balance))),
        }
        // Assert the type to include the 'percentage' property
        return item as typeof item & { percentage: string }
      })
      .slice()
      .sort((a, b) => b.value - a.value)

    // Calculate total lent and borrowed amounts
    const totalLent = lentData.reduce((acc, curr) => acc + curr.value, 0) || 0
    const totalBorrowed = borrowedData.reduce((acc, curr) => acc + curr.value, 0) || 0

    // Calculate percentages for lent and borrowed data
    if (totalLent > 0) {
      lentData.forEach((item) => {
        item.percentage = ((item.value / totalLent) * 100).toFixed(1)
      })
    }

    if (totalBorrowed > 0) {
      borrowedData.forEach((item) => {
        item.percentage = ((item.value / totalBorrowed) * 100).toFixed(1)
      })
    }

    const lentTopThree = lentData.slice(0, 3)
    const borrowTopThree = borrowedData.slice(0, 3)

    const lentOthers = lentData.slice(3)
    const borrowedOthers = borrowedData.slice(3)
    // Calculate total lent and borrowed amounts
    const lentOthersSum = lentOthers.reduce((acc, curr) => acc + curr.value, 0)
    const borrowedOthersSum = borrowedOthers.reduce((acc, curr) => acc + curr.value, 0)

    // Add an "Others" item with percentage
    const lentDataProcessed = [
      ...lentTopThree,
      {
        name: 'Others',
        value: lentOthersSum,
        percentage: ((lentOthersSum / totalLent) * 100).toFixed(1),
      },
    ]
    const borrowedDataProcessed = [
      ...borrowTopThree,
      {
        name: 'Others',
        value: borrowedOthersSum,
        percentage: ((borrowedOthersSum / totalBorrowed) * 100).toFixed(1),
      },
    ]

    return {
      lentData: lentData.length > 3 ? lentDataProcessed : lentData,
      borrowedData: borrowedData.length > 3 ? borrowedDataProcessed : borrowedData,
    }
  }, [accounts.data])

  const { lentData, borrowedData } = chartData
  if (accounts.isLoading || transactions.isLoading) {
    return (
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='h-96 w-full bg-gray-200 animate-pulse' />
        <div className='h-96 w-full bg-gray-200 animate-pulse' />
        <div />
      </div>
    )
  }

  const chartOptionsLent: ApexCharts.ApexOptions = {
    chart: {
      width: 350,
      type: 'donut',
    },
    labels: lentData?.map((ele) => `${ele.name} ${ele.percentage}%`),
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
  const chartSeriesLent: ApexAxisChartSeries | ApexNonAxisChartSeries = lentData?.map((ele) => ele.value)

  const chartOptionsBorrowed: ApexCharts.ApexOptions = {
    chart: {
      width: 350,
      type: 'donut',
    },
    labels: borrowedData?.map((ele) => `${ele.name} ${ele.percentage}%`),
    fill: {
      type: 'gradient',
    },
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
  const chartSeriesBorrowed: ApexAxisChartSeries | ApexNonAxisChartSeries = borrowedData?.map((ele) => ele.value)

  return (
    <div className={cn('flex items-center justify-center flex-col md:flex-row gap-4 w-full', className)} style={style}>
      <div className='w-full flex items-center justify-center flex-col'>
        {lentData?.length > 0 && <div className='text-center'>Lent</div>}
        {lentData?.length > 0 ? (
          <Chart options={chartOptionsLent} series={chartSeriesLent} type='donut' width={400} />
        ) : (
          <div>No Lent Data Available</div>
        )}
        <div>
          Total Lent: {formatIndianMoneyNotation(lentData?.reduce((acc, curr) => acc + curr.value, 0) || 0)}{' '}
          {preferences.currencyUnit}
        </div>
      </div>
      <div className='w-full flex items-center justify-center flex-col'>
        {borrowedData?.length > 0 && <div className='text-center'>Borrowed</div>}
        {borrowedData?.length > 0 ? (
          <Chart options={chartOptionsBorrowed} series={chartSeriesBorrowed} type='donut' width={400} />
        ) : (
          <div>No Borrowed Data Available</div>
        )}
        <div>
          Total Borrowed: {formatIndianMoneyNotation(borrowedData?.reduce((acc, curr) => acc + curr.value, 0) || 0)}{' '}
          {preferences.currencyUnit}
        </div>
      </div>
    </div>
  )
}
