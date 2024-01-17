import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash'
import { useLocation } from 'react-router'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { Form } from '@/components/ui/form'
import { cagrCalculatorSchema } from '@/schema/calculators'
import { parseQueryString } from '@/utils/query-string'
import { calculateCagr } from '@/utils/calculators'
import { handleShare } from '@/utils/clipboard'
import When from '@/components/When/When'
import { CustomLabelPie } from '@/components/shared/CustomLabelPie/CustomLabelPie'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import Page from '@/components/Page/Page'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type CagrValues = z.infer<typeof cagrCalculatorSchema>

const DEFAULT_DATA = {
  initialValue: 5000,
  finalValue: 25000,
  durationOfInvestment: 5,
}

const CAGRHelpTexts: {[key: string]: string} = {
  initialValue: 'This is the starting value or principal investment amount. It represents the value of your investment or asset at the beginning of the investment period.',
  finalValue: 'This is the ending value or the current value of your investment after the specified duration. It represents the value of your investment at the end of the investment period.',
  durationOfInvestment: 'This is the length of time, in years, for which you held the investment. It represents the time period between the initial and final values.'
}

export default function CAGRCalculator() {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)
  const { preferences } = useUserPreferences()
  const location = useLocation()
  const parsedObject = parseQueryString(location.search)

  const form = useForm<CagrValues>({
    resolver: zodResolver(cagrCalculatorSchema),
    defaultValues: !isEmpty(parsedObject) ? parsedObject : DEFAULT_DATA,
    mode: 'all',
  })
  const values = form.watch()

  const inputs: Array<InputField> = [
    {
      id: 'initialValue',
      label: `Initial value (${preferences?.currencyUnit})`,
      type: 'number',
      hasRange: true,
      range: {
        min: 1000,
        max: 100_000_00,
        step: 500,
      },
      helpText: CAGRHelpTexts.initialValue,
    },
    {
      id: 'finalValue',
      label: `Final Value Costs (${preferences?.currencyUnit})`,
      type: 'number',
      hasRange: true,
      range: {
        min: 1000,
        max: 100_000_00,
        step: 500,
      },
      helpText: CAGRHelpTexts.finalValue,
    },
    {
      id: 'durationOfInvestment',
      label: 'Duration of Investment (Years)',
      type: 'number',
      hasRange: true,
      range: {
        min: 1,
        max: 40,
        step: 1,
      },
      helpText: CAGRHelpTexts.durationOfInvestment,
    },
  ]

  const handleCopy = () => {
    setIsCopied(true)
    handleShare(values)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const result = useMemo(() => {
    if (
      !values.durationOfInvestment ||
      !values.finalValue ||
      !values.initialValue ||
      Object.keys(form.formState.errors).length !== 0
    ) {
      return undefined
    }

    const summary = calculateCagr(values.initialValue, values.finalValue, values.durationOfInvestment)
    const pieChartData = [
      {
        name: 'Initial Value',
        value: values.initialValue,
      },
      {
        name: 'Final Value',
        value: values.finalValue,
      },
    ]

    return { summary, pieChartData, barChartData: summary.barChartData }
  }, [values.durationOfInvestment, values.finalValue, values.initialValue, form.formState.errors])

  const excelData = useMemo(() => {
    const data = {
      absoluteCAGR: result?.summary.absoluteCAGR,
      absoluteReturns: result?.summary.absoluteReturns,
      percentageCAGR: result?.summary.percentageCAGR,
    }
    return [{ ...values, ...data }]
  }, [values, result])

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const cagrCalculationWorksheet = XLSX.utils.json_to_sheet(excelData) ?? []
    XLSX.utils.book_append_sheet(wb, cagrCalculationWorksheet, 'CAGR Calculation')
    XLSX.writeFile(wb, 'cagr_calculation.xlsx', { compression: true })
  }

  return (
    <Page className='space-y-4'>
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
        <h2 className='text-2xl font-bold'>CAGR Calculator</h2>
        <p>Calculate your Compound Annual Growth Rate</p>
      </div>

      <div className='flex flex-col md:flex-row gap-4 items-center justify-center'>
        <div className='flex flex-column'>
          <Form {...form}>
            <form className='grid gap-4 w-full'>
              <InputFieldsRenderer control={form.control} inputs={inputs} />
            </form>
          </Form>
        </div>

        <When truthy={typeof result !== 'undefined'}>
          <div className='w-full p-4 flex flex-col gap-4 items-center'>
            <PieChart width={400} height={200}>
              <Pie dataKey='value' data={result?.pieChartData} outerRadius={80} labelLine={false}>
                {result?.pieChartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.name.includes('Initial Value') ? colors.blue['500'] : colors.orange['500']}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomLabelPie />} />
              <Legend height={36} />
            </PieChart>

            <ResponsiveContainer width={500} height={300} className='p-4 my-5'>
              <BarChart
                data={result?.barChartData}
                margin={{
                  right: 30,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey='value'
                  fill={colors.blue['500']}
                  className='border-1 border-black'
                  style={{ border: '1px solid green' }}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className='flex gap-2 border-b'>
              <div>You absolute returns: </div>
              <div className='font-medium'>
                {formatIndianMoneyNotation(parseFloat(result?.summary?.absoluteReturns || '0'))}{' '}
                {preferences.currencyUnit}
              </div>
            </div>
            <div className='flex gap-2 border-b'>
              <div>You absolute CAGR: </div>
              <div className='font-medium'>
                {formatIndianMoneyNotation(parseFloat(result?.summary?.absoluteCAGR || '0'))} {preferences.currencyUnit}
              </div>
            </div>
            <div className='flex gap-2 border-b'>
              <div>You CAGR percentage: </div>
              <div className='font-medium'>{result?.summary?.percentageCAGR} %</div>
            </div>
            <div>
              <Button onClick={handleExportToExcel}>Export to Excel</Button>
            </div>
          </div>
        </When>
      </div>
      <div className='grid gap-4'>
        <h1 className='text-2md font-bold'>CAGR Formula</h1>
        <p>The formula to calculate the Compound Annual Growth Rate (CAGR) is as follows:</p>
        <p><span className='font-bold'> Your Absolute CAGR</span> = (F/I)^(1 / D) - 1</p>
        <p>Where:</p>
        <ul className='list-disc pl-8'>
          <li><span className='font-bold'>F(Final Value):</span> is the ending value or the current value of your investment after the specified duration.</li>
          <li><span className='font-bold'>I(Initial Value):</span> is the starting value or principal investment amount.</li>
          <li><span className='font-bold'>D(Duration):</span> is the length of time, in years, for which you held the investment.</li>
        </ul>
        <ul className='list-disc pl-8'>
          <li><span className='font-bold'>Your Absolute CAGR:</span> is the Compound Annual Growth Rate calculated based on the initial value, final value, and costs.</li>
          <li><span className='font-bold'>Your Absolute CAGR Percentage:</span> represents the annualized growth rate of your investment expressed as a percentage.</li>
          <li><span className='font-bold'>Your Absolute Returns:</span> is the total return on your investment, accounting for the initial value and final value</li>
        </ul>
      </div>
    </Page>
  )
}
