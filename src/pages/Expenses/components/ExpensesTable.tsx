import React, { useCallback, useMemo } from 'react'
import { useQueries } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { EditIcon, LoaderIcon } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EXPENSES, TAGS } from '@/utils/query-keys'
import { fetchExpenseByDate, fetchExpenses } from '@/queries/expense'
import { fetchTags } from '@/queries/tag'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { Button } from '@/components/ui/button'
import DeleteExpense from './DeleteExpense'
import AddOrEditExpenseDialog from './AddOrEditExpenseDialog/AddOrEditExpenseDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type Props = {
  dateRangeEnabled: boolean
  filters: {
    from: string
    to: string
  }
}

export default function ExpensesTable({ dateRangeEnabled, filters }: Props) {
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0

  const { preferences } = useUserPreferences()
  const [expenseQuery, expensesByDateQuery, tagsQuery] = useQueries({
    queries: [
      {
        queryKey: [EXPENSES.EXPENSES, page, dateRangeEnabled],
        queryFn: () => fetchExpenses({ page }),
      },
      {
        queryKey: [EXPENSES.DATE_RANGE, page],
        queryFn: () => fetchExpenseByDate({ from: filters.from, to: filters.to, page }),
        enabled: !!dateRangeEnabled,
      },
      {
        queryKey: [TAGS.TAGS],
        queryFn: fetchTags,
      },
    ],
  })

  const expenses = useMemo(() => {
    if (dateRangeEnabled) {
      return expensesByDateQuery.data ?? []
    }

    return expenseQuery.data ?? []
  }, [dateRangeEnabled, expenseQuery.data, expensesByDateQuery.data])

  const getTagNames = useCallback(
    (tagIds: number[]) => {
      if (!tagsQuery.data) {
        return null
      }

      const foundTags = tagsQuery.data.filter((tag) => tagIds.includes(tag.id))
      return foundTags.map((tag) => tag.name).join(', ')
    },
    [tagsQuery.data],
  )

  if (expenseQuery.isLoading) {
    return (
      <div className='w-full flex items-center justify-center gap-2 h-96'>
        <LoaderIcon className='w-5 h-5 animate-spin' />
        <div>Loading Expenses...</div>
      </div>
    )
  }

  return (
    <Table className='border rounded'>
      <TableCaption className='text-center'>A list of all your expenses</TableCaption>
      <TableHeader className='bg-gray-100/50'>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {formatIndianMoneyNotation(parseFloat(expense.amount))} {preferences.currencyUnit}
            </TableCell>
            <TableCell>{getTagNames(expense.tags)}</TableCell>
            <TableCell>{dayjs(expense.time).format('ddd MMM DD, YYYY')}</TableCell>
            <TableCell className='flex'>
              <AddOrEditExpenseDialog
                expense={expense}
                trigger={
                  <Button size='sm' variant='ghost'>
                    <EditIcon className='w-4 h-4' />
                  </Button>
                }
              />
              <DeleteExpense id={expense.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
