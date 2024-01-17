import React, { useMemo, useState } from 'react'
import * as XLSX from 'xlsx'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isEmpty } from 'lodash'
import { useLocation } from 'react-router'
import dayjs from 'dayjs'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { emiCalculatorSchema } from '@/schema/calculators'
import { parseQueryString } from '@/utils/query-string'
import { Form } from '@/components/ui/form'
import InputFieldsRenderer, { InputField } from '@/components/InputFieldsRenderer/InputFieldsRenderer'
import { handleShare } from '@/utils/clipboard'
import { calculateAssetsForEmi, calculateEmi, calculateTenureByUnit } from '@/utils/calculators'
import When from '@/components/When/When'
// @ts-expect-error
import { AssetsLiabilitiesChart } from '../../components/Charts/AssetsLiabilitiesChart'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type EmiValues = z.infer<typeof emiCalculatorSchema>

const DEFAULT_DATA: EmiValues = {
  loanPrincipal: 300000,
  loanInterest: 11,
  loanTenure: 3,
  emiDay: 5,
  disbursementDate: new Date(),
}

const EmiHelpTexts: { [key: string]: string } = {
  loanPrincipal:
    "This is the total amount of money you wish to borrow.It's the initial loan amount you receive. For example, if you want to borrow Rs 50,000 this is your loan principal.",
  loanInterest:
    "The loan interest rate is the annual rate at which you are borrowing money. It's expressed as a percentage. For instance, if your loan carries an annual interest rate of 5%, you'd enter 5 as the interest rate.",
  loanTenure:
    'This field represents the total duration, provided in months, over which you will be repaying the loan. For example, if you plan to repay the loan in 3 years, which is 36 months, you would enter 36 months as the loan tenure.',
  disbursementDate:
    "This is the date when you receive the loan amount. It's essential for calculating the exact interest applicable for each installment.",
  emiDay:
    'The EMI day is the day of each month on which you want to make your EMI payment. Different lenders may offer various options for selecting the EMI date.',
}

// @TODO: add unit change options
const EmiCalculator = () => {
  const location = useLocation()
  const parsedObject = parseQueryString(location.search)
  const [isCopied, setIsCopied] = useState(false)

  const { toast } = useToast()
  const { preferences } = useUserPreferences()

  const form = useForm<EmiValues>({
    resolver: zodResolver(emiCalculatorSchema),
    defaultValues: !isEmpty(parsedObject) ? parsedObject : DEFAULT_DATA,
    mode: 'all',
  })
  const values = form.watch()

  const result = useMemo(() => {
    if (
      !values.loanPrincipal ||
      !values.loanInterest ||
      !values.loanTenure ||
      Object.keys(form.formState.errors).length !== 0
    ) {
      return undefined
    }

    const summary = calculateEmi(values.loanPrincipal, values.loanInterest, values.loanTenure, 'Months')
    const assets = calculateAssetsForEmi(values.loanPrincipal, summary?.total_interest_payable!)
    const tenure = calculateTenureByUnit('Months', values.loanTenure)

    return { summary, assets, tenure }
  }, [values.loanInterest, values.loanPrincipal, values.loanTenure, form.formState.errors])

  const inputs: Array<InputField> = [
    {
      id: 'loanPrincipal',
      label: 'Loan Principal',
      type: 'number',
      hasRange: true,
      range: {
        min: 0,
        max: 10000000,
        step: 100,
      },
      helpText: EmiHelpTexts.loanPrincipal,
    },
    {
      id: 'loanInterest',
      label: 'Loan Interest',
      type: 'number',
      hasRange: true,
      range: {
        min: 0,
        max: 100,
        step: 1,
      },
      helpText: EmiHelpTexts.loanInterest,
    },
    {
      id: 'loanTenure',
      label: 'Loan Tenure',
      type: 'number',
      className: 'col-span-full',
      hasRange: true,
      range: {
        min: 0,
        max: 240,
        step: 6, // @TODO: Update according to unit
      },
      helpText: EmiHelpTexts.loanTenure,
    },
    {
      id: 'disbursementDate',
      label: 'Disbursement Date',
      type: 'date',
      defaultDate: !isEmpty(parsedObject) ? dayjs.unix(parsedObject.disbursementDate as number).toDate() : new Date(),
      helpText: EmiHelpTexts.disbursementDate,
    },
    {
      id: 'emiDay',
      label: 'Emi Day',
      type: 'number',
      helpText: EmiHelpTexts.emiDay,
    },
  ]

  const handleCopy = () => {
    setIsCopied(true)
    handleShare({ ...values, disbursementDate: dayjs(values.disbursementDate).unix() * 1000 })
    setTimeout(() => setIsCopied(false), 3000)
  }

  const excelData = useMemo(() => {
    const data = {
      loanEmi: result?.summary?.loan_emi,
      totalInterestPayable: result?.summary?.total_interest_payable,
      totalPayment: result?.summary?.total_payment,
    }
    return [{ ...values, ...data }]
  }, [values, result])

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const emiCalculationWorksheet = XLSX.utils.json_to_sheet(excelData) ?? []
    const emiMonthlyCalculationWorksheet = XLSX.utils.json_to_sheet(result?.summary?.repayment_table ?? []) ?? []
    const emiCalculationJson = XLSX.utils.sheet_to_json(emiCalculationWorksheet, { header: 1 })
    const emiMonthlyCalculationJson = XLSX.utils.sheet_to_json(emiMonthlyCalculationWorksheet, { header: 1 })
    const mergedWorksheet = emiCalculationJson.concat([[''], [''], ['']]).concat(emiMonthlyCalculationJson)
    const finalWorksheet = XLSX.utils.json_to_sheet(mergedWorksheet, { skipHeader: true })
    XLSX.utils.book_append_sheet(wb, finalWorksheet, 'EMI Calculation')
    XLSX.writeFile(wb, 'emi_calculation.xlsx', { compression: true })
  }

  return (
    <div className='max-w-screen-xl mx-auto p-4 space-y-4'>
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

      <h2 className='text-2xl font-bold text-center'>EMI Calculator</h2>

      <Form {...form}>
        <form className='grid md:grid-cols-2 gap-4'>
          <InputFieldsRenderer control={form.control} inputs={inputs} />
        </form>
      </Form>

      <When truthy={typeof result !== 'undefined'}>
        <h2 className='text-2xl text-center'>Summary</h2>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='flex items-center justify-center flex-col gap-4 text-center'>
            <div>
              <div>Loan EMI</div>
              <div className='text-2xl font-medium'>
                {formatIndianMoneyNotation(parseFloat(result?.summary?.loan_emi as string))} {preferences.currencyUnit}
              </div>
            </div>
            <div>
              <div>Total Interest Payable</div>
              <div className='text-2xl font-medium'>
                {formatIndianMoneyNotation(parseFloat(result?.summary?.total_interest_payable as string))}{' '}
                {preferences.currencyUnit}
              </div>
            </div>
            <div>
              <div>Total Payment</div>
              <div className='text-2xl font-medium'>
                {formatIndianMoneyNotation(parseFloat(result?.summary?.total_payment as string))}{' '}
                {preferences.currencyUnit}
              </div>
            </div>
            <div>
              <Button onClick={handleExportToExcel}>Export to Excel</Button>
            </div>
          </div>

          <AssetsLiabilitiesChart data={result?.assets} type='assets' />
        </div>
      </When>

      <Table className='border rounded shadow-sm'>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Total Payment</TableHead>
            <TableHead>Outstanding Principal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result?.summary?.repayment_table.map((record) => (
            <TableRow key={record.month}>
              <TableCell>{Math.abs(record.month)}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Math.abs(record.principal))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Math.abs(record.interest))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Math.abs(record.total_payment))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Math.abs(record.outstandingPrincipal))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className='grid gap-4'>
        <h1 className='font-bold'>EMI Formula</h1>
        <p>The formula to calculate the Equated Monthly Installment (EMI) is as follows:</p>
        <pre>EMI = P * (r * (1 + r)^n) / ((1 + r)^n - 1)</pre>
        <p>Where:</p>
        <ul className='list-disc pl-8'>
          <li>
            <span className='font-bold'>EMI:</span> Equated Monthly Installment, the fixed amount you need to pay every
            month.
          </li>
          <li>
            <span className='font-bold'>P:</span> Loan Principal, the initial loan amount you receive.
          </li>
          <li>
            <span className='font-bold'>r:</span> Monthly interest rate, calculated from the Loan Interest Rate.
          </li>
          <li>
            <span className='font-bold'>n:</span> Total number of EMIs you need to pay over the Loan Tenure (in months).
          </li>
        </ul>
        <ul>
          <li>
            <span className='font-bold'>Total Interest Payable:</span>The total amount you pay in interest over the loan
            tenure.
          </li>
          <li>
            <span className='font-bold'>Total Payment:</span> The total amount you repay, including both the principal
            and interest.
          </li>
        </ul>
        <p>
          The EMI formula helps you calculate the monthly repayment amount for a loan based on the principal, interest
          rate, and loan tenure.
        </p>
      </div>
    </div>
  )
}

export default EmiCalculator
