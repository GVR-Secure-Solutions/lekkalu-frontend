import React, { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import * as XLSX from 'xlsx'
import { isEmpty } from 'lodash'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pie, PieChart, Cell, Tooltip, Legend } from 'recharts'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { parseQueryString } from '@/utils/query-string'
import { sipCalculatorSchema } from '@/schema/calculators'
import { Form } from '@/components/ui/form'
import { calculateSip } from '@/utils/calculators'
import { CustomLabelPie } from '@/components/shared/CustomLabelPie/CustomLabelPie'
import When from '@/components/When/When'
import { useToast } from '@/components/ui/use-toast'
import { handleShare } from '@/utils/clipboard'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import Page from '@/components/Page/Page'
import { formatIndianMoneyNotation } from '@/utils/format-money'

const DEFAULT_DATA = {
  monthlyAmount: 500,
  durationInvestment: 1,
  rateReturn: 1,
}

const SIPHelpTexts: {[key: string]: string} = {
  monthlyAmount: 'This is the amount you plan to invest each month.',
  durationInvestment: 'Specify how long you intend to continue your SIP investments.',
  rateReturn: 'Estimate the average annual return you expect from your investments.'
}

type SipValues = z.infer<typeof sipCalculatorSchema>

export default function SIPCalculator() {
  const location = useLocation()
  const parsedObject = parseQueryString(location.search)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()
  const { preferences } = useUserPreferences()

  const form = useForm<SipValues>({
    resolver: zodResolver(sipCalculatorSchema),
    defaultValues: !isEmpty(parsedObject) ? parsedObject : DEFAULT_DATA,
    mode: 'all',
  })
  const values = form.watch()

  const inputs: Array<InputField> = [
    {
      id: 'monthlyAmount',
      label: `Monthly investment amount ${preferences.currencyUnit}`,
      type: 'number',
      hasRange: true,
      range: {
        min: 500,
        max: 100_000,
        step: 500,
      },
      helpText: SIPHelpTexts.monthlyAmount,
    },
    {
      id: 'durationInvestment',
      label: 'Duration of the investment (Yr)',
      type: 'number',
      hasRange: true,
      range: {
        min: 1,
        max: 40,
        step: 1,
      },
      helpText: SIPHelpTexts.durationInvestment,
    },
    {
      id: 'rateReturn',
      label: 'Expected annual return (%)',
      type: 'number',
      hasRange: true,
      range: {
        min: 1,
        max: 30,
        step: 0.1,
      },
      helpText: SIPHelpTexts.rateReturn,
    },
  ]

  const result = useMemo(() => {
    if (
      !values.durationInvestment ||
      !values.monthlyAmount ||
      !values.rateReturn ||
      Object.keys(form.formState.errors).length !== 0
    ) {
      return undefined
    }

    const summary = calculateSip(values.monthlyAmount, values.durationInvestment, values.rateReturn)
    const pieData = [
      { name: 'Total Invested', value: summary.totalInvested },
      { name: 'Wealth Gained', value: summary.wealthGained },
    ]

    return { summary, pieData }
  }, [values.durationInvestment, values.monthlyAmount, values.rateReturn, form.formState.errors])

  const handleCopy = () => {
    setIsCopied(true)
    handleShare(values)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const sipCalculationWorksheet = XLSX.utils.json_to_sheet([{ ...values, ...result?.summary }]) ?? []
    XLSX.utils.book_append_sheet(wb, sipCalculationWorksheet, 'SIP Calculation')
    XLSX.writeFile(wb, 'sip_calculation.xlsx', { compression: true })
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
        <h2 className='text-2xl font-bold'>SIP Calculator</h2>
        <p>Calculate returns on your SIP investments.</p>
      </div>
      <div className='grid md:grid-cols-2 gap-1 pt-2'>
        <div className='flex flex-col md:flex-row gap-2 justify-center w-full'>
          <div className='space-y-4 pt-10'>
            <Form {...form}>
              <form className='grid gap-4'>
                <InputFieldsRenderer control={form.control} inputs={inputs} />
              </form>
            </Form>
          </div>

          <When truthy={typeof result !== 'undefined'}>
            <div>
              <div className='text-xl text-center'>Summary</div>

              <div className='w-full p-4 flex flex-col gap-4 items-center'>
                <div className='flex gap-2 border-b'>
                  <div>Total invested: </div>
                  <div className='font-medium'>
                    {formatIndianMoneyNotation(result?.summary?.totalInvested)} {preferences.currencyUnit}
                  </div>
                </div>
                <div className='flex gap-2 border-b'>
                  <div>Final value: </div>
                  <div className='font-medium'>
                    {formatIndianMoneyNotation(result?.summary?.finalValue)} {preferences.currencyUnit}
                  </div>
                </div>
                <div className='flex gap-2 border-b'>
                  <div>Wealth gained: </div>
                  <div className='font-medium'>
                    {formatIndianMoneyNotation(result?.summary?.wealthGained)} {preferences.currencyUnit}
                  </div>
                </div>

                <PieChart width={200} height={220}>
                  <Pie dataKey='value' data={result?.pieData} outerRadius={80} labelLine={false}>
                    {result?.pieData.map((item, index) => (
                      <Cell key={index} fill={item.name.includes('Total Invested') ? '#099fea' : '#09ea49'} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<CustomLabelPie />} />
                </PieChart>
                <div>
                  <Button onClick={handleExportToExcel}>Export to Excel</Button>
                </div>
              </div>
            </div>
          </When>
        </div>
        <div className='grid gap-3'>
          <h1 className='text-2md font-bold'>About SIP Calculator</h1>
          <p>To estimate your potential returns with a Systematic Investment Plan (SIP), you need to provide three key pieces of information:</p>
          <ul className='list-disc pl-8'>
            <li><span className='font-bold'>Monthly Investment Amount:</span> This is the amount you plan to invest each month.</li>
            <li><span className='font-bold'>Duration of the Investment:</span> Specify how long you intend to continue your SIP investments.</li>
            <li><span className='font-bold'>Expected Annual Return (%):</span> Estimate the average annual return you expect from your investments.</li>
          </ul>
          <p>After entering these details, the SIP Calculator will provide you with an estimate of your potential wealth creation and returns.</p>
          <h1 className='font-bold'>SIP Calculator Formula</h1>
          <p>The formula to calculate the future value of your SIP investment is:</p>
          <p><strong>Future Value of SIP Investment (FV) = P * ([(1 + r)^n - 1]/r)(1 + r)</strong></p>
          <p>Where:</p>
          <ul className='list-disc pl-8'>
            <li><span className='font-bold'>FV</span> is the Future Value of your investment at the end of the SIP duration.</li>
            <li><span className='font-bold'>P</span> is the Monthly Investment Amount you contribute.</li>
            <li><span className='font-bold'>r</span> is the monthly interest rate, calculated from the Expected Annual Return. The formula for monthly interest rate is: <strong>r = [(Annual rate/100)/12]</strong></li>
            <li><span className='font-bold'>n</span> is the total number of contributions, calculated as the product of the Duration of Investment (in years) and 12 (for monthly contributions).</li>
          </ul>
        </div>
      </div>
    </Page>
  )
}
