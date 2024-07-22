import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { isEmpty } from 'lodash'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import { differenceInCalendarMonths, addMonths, format } from 'date-fns'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { z } from 'zod'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { parseQueryString } from '@/utils/query-string'
import { xirrCalculatorSchema } from '@/schema/calculators'
import { Form } from '@/components/ui/form'
import { calculateXIRR } from '@/utils/calculators'
import When from '@/components/When/When'
import { useToast } from '@/components/ui/use-toast'
import { handleShare } from '@/utils/clipboard'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import Page from '@/components/Page/Page'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { cn } from '@/utils/utils'

type XIRRValues = z.infer<typeof xirrCalculatorSchema>

interface CashFlow {
  amount: number
  when: Date
}

const DEFAULT_DATA: XIRRValues = {
  startDate: new Date(2024, 0, 1),
  endDate: new Date(2024, 11, 1),
  maturityDate: new Date(2024, 11, 15),
  investedAmount: 5000,
  maturityAmount: 65000,
}

const XIRRHelpTexts = {
  startDate: 'Select the start date of your Monthly Invested Amount.',
  endDate: 'Select the end date of your Monthly Invested Amount.',
  maturityDate: 'Select the maturity date of your maturity investments.',
  investedAmount: 'Specify the amount you are investing each month.',
  maturityAmount: 'Specify the amount you expect at maturity.',
}

export default function XIRRCalculator() {
  const location = useLocation()
  const parsedObject = parseQueryString(location.search)
  const [isCopied, setIsCopied] = useState(false)
  const [cashFlowData, setCashFlowData] = useState<Array<CashFlow>>([])
  const [xirrResult, setXirrResult] = useState<{ xirr: number; totalDays: number }>({ xirr: 0, totalDays: 0 })
  const [totalInvestedAmount, setTotalInvestedAmount] = useState<number>(DEFAULT_DATA.investedAmount)
  const { toast } = useToast()
  const { preferences } = useUserPreferences()

  const form = useForm<XIRRValues>({
    resolver: zodResolver(xirrCalculatorSchema),
    defaultValues: !isEmpty(parsedObject) ? parsedObject : DEFAULT_DATA,
  })
  const values = form.watch()

  const inputs: Array<InputField> = [
    {
      id: 'startDate',
      label: 'Start Date',
      type: 'date',
      defaultDate: !isEmpty(parsedObject) ? dayjs(parsedObject.startDate).toDate() : new Date(),
      helpText: XIRRHelpTexts.startDate,
    },
    {
      id: 'endDate',
      label: 'End Date',
      type: 'date',
      defaultDate: !isEmpty(parsedObject) ? dayjs(parsedObject.endDate).toDate() : new Date(),
      helpText: XIRRHelpTexts.endDate,
    },
    {
      id: 'investedAmount',
      label: `Monthly Invested Amount ${preferences.currencyUnit}`,
      type: 'number',
      hasRange: true,
      range: {
        min: 100,
        max: 1000000,
        step: 1000,
      },
      helpText: XIRRHelpTexts.investedAmount,
    },
    {
      id: 'maturityAmount',
      label: `Maturity Amount ${preferences.currencyUnit}`,
      type: 'number',
      hasRange: true,
      range: {
        min: 100,
        max: 1000000,
        step: 1000,
      },
      helpText: XIRRHelpTexts.maturityAmount,
    },
    {
      id: 'maturityDate',
      label: 'Maturity Date',
      type: 'date',
      defaultDate: !isEmpty(parsedObject) ? dayjs(parsedObject.maturityDate).toDate() : DEFAULT_DATA.maturityDate,
      helpText: XIRRHelpTexts.maturityDate,
    },
  ]

  const handleXIRRCalculation = () => {
    const { startDate, endDate, investedAmount, maturityAmount, maturityDate } = values

    // Convert startDate, endDate, and maturityDate to Date objects if they are strings
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const maturityDateObj = new Date(maturityDate)

    // Calculate the number of months between startDate and endDate
    const monthsDiff = differenceInCalendarMonths(endDateObj, startDateObj)

    // Calculate the total invested amount
    const totalInvestedAmount = (monthsDiff + 1) * investedAmount
    setTotalInvestedAmount(totalInvestedAmount)

    // Generate cash flows based on investedAmount and maturityAmount
    const cashFlows = []

    for (let index = 0; index <= monthsDiff; index++) {
      const currentDate = addMonths(startDateObj, index)
      cashFlows.push({ amount: -investedAmount, when: currentDate })
    }

    // Add the maturity amount and maturity date
    cashFlows.push({ amount: maturityAmount, when: maturityDateObj })
    setCashFlowData(cashFlows)
    const result = calculateXIRR(cashFlows)
    setXirrResult(result)
  }

  const transformValues = (values: XIRRValues): Record<string, string | number> => {
    return {
      ...values,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      maturityDate: values.maturityDate.toISOString(),
    }
  }

  const handleCopy = () => {
    setIsCopied(true)
    const transformedValues = transformValues(values)
    handleShare(transformedValues)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const excelData = useMemo(() => {
    const cashFlows = [
      ...Array.from({ length: differenceInCalendarMonths(values.endDate, values.startDate) + 1 }, (_, index) => ({
        date: format(addMonths(values.startDate, index), 'dd-MM-yyyy'),
        amount: -values.investedAmount,
      })),
      {
        date: format(values.maturityDate, 'dd-MM-yyyy'),
        amount: values.maturityAmount,
      },
    ]

    const summaryData = {
      date: 'Total(Maturity Amount-Total Amount)',
      amount: values.maturityAmount - totalInvestedAmount,
      totalInvestedAmount,
      xirr: xirrResult?.xirr,
      totalDays: xirrResult?.totalDays,
    }

    const resultData = [...cashFlows, summaryData]

    return resultData
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Adjust column headers and their order if needed
    const headers = [['DATE', 'AMOUNT', 'TOTAL INVESTED AMOUNT', 'XIRR(%)', 'TOTALDAYS']]
    XLSX.utils.sheet_add_aoa(worksheet, headers, { origin: 'A1' })

    // Set column widths
    const colWidths = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
    worksheet['!cols'] = colWidths

    XLSX.utils.book_append_sheet(wb, worksheet, 'XIRR Calculation')
    XLSX.writeFile(wb, 'xirr_calculation.xlsx', { compression: true })
  }

  // Pie Chart
  const chartOptionsXIRR: ApexCharts.ApexOptions = {
    chart: {
      width: 350,
      type: 'pie',
    },
    labels: ['Invested Amount', 'Maturity Amount'],
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

  const chartSeriesXIRR: ApexAxisChartSeries | ApexNonAxisChartSeries = [totalInvestedAmount, values.maturityAmount]

  // Bar chart
  const cashBarChartOptionsXIRR: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 550,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      categories: excelData.map((entry) => entry.date),
    },
    yaxis: {
      title: {
        text: 'Amount',
      },
    },
  }

  const cashBarChartSeriesXIRR: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: 'Amount',
      data: excelData.map((entry) => entry.amount),
    },
  ]

  return (
    <Page className='max-w-screen-xl mx-auto p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <Button
          onClick={() => {
            toast({
              title: 'Feature under development!',
              description: 'The feature you are trying to use is under development!',
            })
          }}
        >
          Save
        </Button>
        <Button onClick={handleCopy}>{isCopied ? 'Copied!' : 'Share'}</Button>
      </div>

      <div className='text-center'>
        <h2 className='text-2xl font-bold'>XIRR Calculator</h2>
        <p>Maximize Your Investment Returns with XIRR Calculator</p>
      </div>
      <div className=''>
        <div className='space-y-4 pt-10'>
          <Form {...form}>
            <form
              className='grid md:grid-cols-2 gap-4'
              onSubmit={form.handleSubmit(handleXIRRCalculation)}
            >
              <InputFieldsRenderer control={form.control} inputs={inputs} />
              <div className=' pt-6'>
                <Button type='submit'>Calculate XIRR</Button>
              </div>
            </form>
          </Form>
        </div>

        <When truthy={xirrResult.xirr !== 0}>
          <div className='text-2xl text-center py-10'>Summary</div>
          <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className='flex flex-col items-center justify-center gap-4 text-center'>
              <div>
                <div>Total invested:</div>
                <div className='text-2xl font-medium'>
                  {formatIndianMoneyNotation(totalInvestedAmount)} {preferences.currencyUnit}
                </div>
              </div>
              <div>
                <div>XIRR:</div>
                <div className='flex justify-center items-center gap-4 text-2xl font-medium'>
                  {xirrResult?.xirr >= 0 ? <TrendingUp color='#48bb78' /> : <TrendingDown color='#f44336' />}
                  <span
                    className={cn({
                      'text-green-500': xirrResult?.xirr >= 0,
                      'text-red-500': xirrResult?.xirr < 0,
                    })}
                  >
                    {xirrResult?.xirr.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div>
                <div>Total Days:</div>
                <div className='text-2xl font-medium'>{xirrResult?.totalDays.toFixed(2)}</div>
              </div>
              <div>
                <Button onClick={handleExportToExcel}>Export to Excel</Button>
              </div>
            </div>
            <div className='flex justify-center'>
              <Chart options={chartOptionsXIRR} series={chartSeriesXIRR} type='pie' width={350} />
            </div>
            <div className='flex justify-center'>
              <Chart options={cashBarChartOptionsXIRR} series={cashBarChartSeriesXIRR} type='bar' width={400} />
            </div>
          </div>
        </When>

        {xirrResult.xirr !== 0 ? (
          <div className='flex justify-center pt-10'>
            <Table className='border rounded shadow-sm m-auto'>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Cash Flow</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashFlowData?.map((record: { when: Date; amount: number }, i) => (
                  <TableRow key={i}>
                    <TableCell>{new Date(record.when).toLocaleDateString()}</TableCell>
                    <TableCell>{record.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </div>
      <div className='grid gap-3'>
        <h1 className='text-2md font-bold'>About XIRR Calculator</h1>
        <p>
          To estimate your potential returns with a Systematic Investment Plan (XIRR), you need to provide three key
          pieces of information:
        </p>
        <ul className='list-disc pl-8'>
          <li>
            <span className='font-bold'>Invested Amount {preferences.currencyUnit}:</span> This is the fixed amount you
            invest regularly in your SIP each month.
          </li>
          <li>
            <span className='font-bold'>Start Date:</span> This is the date of your first SIP investment.
          </li>
          <li>
            <span className='font-bold'>End Date:</span> This is the date of your last SIP investment (if applicable) or
            the date up to which you want to analyze the performance.
          </li>
          <li>
            <span className='font-bold'>Matuarity Amount:</span> Defines the accumulated total value of investments by
            maturity, reflecting the final amount.
          </li>
          <li>
            <span className='font-bold'>Matuarity Date:</span> Specifies the date marking the maturity of the
            investments, signifying the end of the investment period.
          </li>
        </ul>
        <p>
          After entering these details, the XIRR Calculator will provide you with an estimate of your potential wealth
          creation and returns.
        </p>
        <h1 className='font-bold'>XIRR Calculator Formula</h1>
        <p>The formula used in the calculate XIRR function is derived from the Newton-Raphson method :</p>
        <ul className='list-decimal pl-10'>
          <li>
            <b>Absolute Value Function:</b>
            <p className='p-2'>
              Absolute&nbsp;Value(rate) = ∑<sub>i=1</sub>
              <sup>i=n</sup> (1 + rate)
              <sup>
                T<sub>ti</sub>
              </sup>
              C<sub>i</sub>
            </p>
          </li>
          <li>
            {' '}
            <b>Derivative Value Function:</b>
            <p className='p-2'>
              Derivative&nbsp;Value(rate) = ∑<sub>i=1</sub>
              <sup>n</sup> −T⋅365C<sub>i</sub>⋅t<sub>i</sub>⋅(1+rate)
              <sup>
                T<sub>ti</sub>
              </sup>
              +1
            </p>
            <p>where:</p>
            <ul className='list-disc pl-10'>
              <li>
                <p>The -T⋅365 term converts the time difference (ti) from days to years (assuming a 365-day year).</p>
              </li>
            </ul>
          </li>
          <li>
            {' '}
            <b>Newton-Raphson Iteration:</b>
            <p className='p-2'>
              rate<sub>n+1</sub> = rate<sub>n</sub> -{' '}
              <span style={{ whiteSpace: 'nowrap' }}>
                &frac12; Derivative Value(rate<sub>n</sub>) / Absolute Value(rate<sub>n</sub>)
              </span>
            </p>
            <p>where:</p>
            <ul className='list-disc pl-10'>
              <li>
                <p>
                  rate<sub>n+1</sub> = This represents the improved interest rate estimate after each iteration.
                </p>
              </li>
              <li>
                <p>
                  rate<sub>n</sub>- ½ (Derivative Value(raten) / Absolute Value(rate<sub>n</sub>)) = This represents the
                  improved interest rate estimate after each iteration.
                </p>
              </li>
            </ul>
          </li>
        </ul>
        <p>where:</p>
        <ul className='list-disc pl-8 pb-8'>
          <li>
            <strong>∑</strong> = This symbol represents summation, meaning we&apos;re adding up the following terms for
            each cash flow (i) from 1 to n
          </li>
          <li>
            <strong>rate</strong> = An optional input value for the XIRR function. It provides a starting point for the
            iterative process to find the actual IRR. The default guess is 0.1 (10%) if not specified.
          </li>
          <li>
            <strong>
              T<sub>ti</sub>
            </strong>{' '}
            = his represents the time difference (in years) between the investment date and the cash flow date for cash
            flow i.
          </li>
          <li>
            <strong>
              C<sub>i</sub>
            </strong>{' '}
            = This represents the cash flow amount for cash flow i. (Positive for inflows, negative for outflows)
          </li>
        </ul>
      </div>
    </Page>
  )
}
