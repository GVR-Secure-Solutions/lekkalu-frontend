import React, { useState } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import { fetchBudgets } from '@/queries/budget'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import AddOrEditExpenseDialog from './components/AddOrEditExpenseDialog/AddOrEditExpenseDialog'
import { Button } from '@/components/ui/button'
import { ExpenseFiltersSchema, expenseFiltersSchema } from '@/schema/expense'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import DatePicker from '@/components/DatePicker/DatePicker'
import ExpensesTable from './components/ExpensesTable'
import ViewAllBudgetModal from './components/ViewAllBudgetModal'
import SetBudgetModal from './components/SetBudgetModal'
import Pagination from '@/components/Pagination/Pagination'
import { WeeklyChart } from '@/components/Charts/WeeklyChart'
import { SpentBalanceChart } from '@/components/Charts/SpentBalanceChart'
import { CumSumChart } from '@/components/Charts/CumSumChart'

dayjs.extend(customParseFormat)
export type totalExpensesMetadataType =
  | {
      page: number
      per_page: number
      page_count: number
      total_count: number
      Links: {
        self?: string
        first?: string
        previous?: string
        next?: string
      }[]
    }
  | undefined
export default function Expenses() {
  const { preferences } = useUserPreferences()
  const [searchParams, setSearchParams] = useSearchParams()
  const [dateRangeEnabled, setDateRangeEnabled] = useState(false)
  const [totalExpensesMetadata, setTotalExpensesMetadata] = useState<totalExpensesMetadataType>()

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0

  const { data: budgets } = useQuery([BUDGET_QUERY_KEYS.BUDGETS], fetchBudgets)

  const filtersForm = useForm<ExpenseFiltersSchema>({
    resolver: zodResolver(expenseFiltersSchema),
  })
  const filters = filtersForm.watch()

  const currentMonthBudget = budgets?.find((item) =>
    dayjs(item.month, 'YYYY-MM-DD').startOf('month').isSame(dayjs().startOf('month')),
  )

  const handleFilters = () => {
    setDateRangeEnabled(true)
  }

  const handleClearFilters = () => {
    filtersForm.clearErrors()
    filtersForm.reset()
    setDateRangeEnabled(false)
  }
  const maxPage = Math.ceil((totalExpensesMetadata?.total_count || 0) / 10) - 1

  return (
    <div className='max-w-screen-xl mx-auto align-self-start min-h-[80vh] p-4 space-y-4'>
      <div className='grid md:grid-cols-2 gap-4'>
        <WeeklyChart />
        <SpentBalanceChart />
        <CumSumChart />
      </div>

      <div className='border rounded-2 shadow-sm w-100 p-4 flex flex-col gap-2 max-w-md'>
        <div className='text-2xl font-bold'>Budget</div>
        <div className='flex items-center gap-2'>
          <div>{dayjs().format('MMMM')}</div>
          <div className='font-bold'>
            {currentMonthBudget ? `${currentMonthBudget.limit} ${preferences?.currencyUnit}` : 'Not budget set'}
          </div>
        </div>

        <div className='flex items-center gap-2 w-100'>
          <SetBudgetModal />
          <ViewAllBudgetModal />
        </div>
      </div>

      <div className='flex items-center justify-center'>
        <AddOrEditExpenseDialog trigger={<Button>Add Expense</Button>} />
      </div>

      <div className='text-2xl font-bold my-4 text-center'>Expense List</div>
      <div className='flex justify-between items-center my-2'>
        {/* Pagination */}
        <div className='flex items-center gap-2'>
          <Pagination
            showSkipButtons
            disablePrevious={page === 0}
            disableNext={page * 10 + 10 >= (totalExpensesMetadata?.total_count ?? 0)}
            onSkipPrevious={() => {
              setSearchParams((prev) => {
                prev.set('page', Math.max(page - 3, 0).toString())
                return prev
              })
            }}
            onPrevious={() => {
              setSearchParams((prev) => {
                prev.set('page', Math.max(page - 1, 0).toString())
                return prev
              })
            }}
            onNext={() => {
              setSearchParams((prev) => {
                prev.set('page', Math.min(page + 1, 6).toString())
                return prev
              })
            }}
            onSkipNext={() => {
              setSearchParams((prev) => {
                prev.set('page', Math.min(page + 3, maxPage).toString())
                return prev
              })
            }}
          />

          <div>
            {page * 10 + 1} - {Math.min((page + 1) * 10, totalExpensesMetadata?.total_count ?? 0)} of{' '}
            {totalExpensesMetadata?.total_count}
          </div>
        </div>

        {/* Filters */}
        <Form {...filtersForm}>
          <form onSubmit={filtersForm.handleSubmit(handleFilters)} className='flex gap-2'>
            <FormField
              control={filtersForm.control}
              name='from'
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <DatePicker placeholder='From' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <FormField
              control={filtersForm.control}
              name='to'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker placeholder='to' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={!filtersForm.formState.isValid}>
              Filter
            </Button>
            <Button variant='destructive' onClick={handleClearFilters}>
              Clear
            </Button>
          </form>
        </Form>
      </div>

      <ExpensesTable
        setTotalExpensesMetadata={setTotalExpensesMetadata}
        dateRangeEnabled={dateRangeEnabled}
        filters={{
          from: dayjs(filters.from).format('YYYY-MM-DD'),
          to: dayjs(filters.to).format('YYYY-MM-DD'),
        }}
      />
    </div>
  )
}
