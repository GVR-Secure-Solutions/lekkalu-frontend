import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { capitalize } from 'lodash'
import { LoaderIcon, PencilIcon } from 'lucide-react'
import { IncomeStatement } from '@/types/income-statement'
import { INCOME_STATEMENT } from '@/utils/query-keys'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import When from '@/components/When/When'
import AddOrEditIncomeExpense from './AddOrEditIncomeExpense'
import { Button } from '@/components/ui/button'
import { AddIncomeStatementSchema } from '@/schema/income-statement'
import DeleteIncomeStatement from './DeleteIncomeStatement'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type TableType = 'EXPENSE' | 'INCOME'

type Props = {
  type: TableType
  queryFn: () => Promise<IncomeStatement[]>
  createMutationFn: (dto: AddIncomeStatementSchema) => Promise<void>
  updateMutationFn: (id: number, dto: AddIncomeStatementSchema) => Promise<void>
  deleteMutationFn: (id: number) => Promise<void>
}

export default function IncomeExpenseTable({
  queryFn,
  type,
  createMutationFn,
  updateMutationFn,
  deleteMutationFn,
}: Props) {
  const { data, isFetching } = useQuery(
    [type === 'INCOME' ? INCOME_STATEMENT.SOURCES : INCOME_STATEMENT.IS_EXPENSES],
    queryFn,
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-end'>
        <AddOrEditIncomeExpense
          trigger={<Button>Add {capitalize(type)}</Button>}
          type={type}
          createMutationFn={createMutationFn}
          updateMutationFn={updateMutationFn}
        />
      </div>
      <Table className='border rounded'>
        <TableCaption className='text-center'>A list of Income/Expenses</TableCaption>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isFetching}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {data?.map((incomeStatement) => (
            <TableRow key={incomeStatement.id}>
              <TableCell>{incomeStatement.name}</TableCell>
              <TableCell>{incomeStatement.type}</TableCell>
              <TableCell>{formatIndianMoneyNotation(parseFloat(incomeStatement.amount))}</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditIncomeExpense
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-5' />
                    </Button>
                  }
                  type={type}
                  createMutationFn={createMutationFn}
                  updateMutationFn={updateMutationFn}
                  incomeStatement={incomeStatement}
                />

                <DeleteIncomeStatement id={incomeStatement.id} type={type} deleteMutationFn={deleteMutationFn} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
