import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { IncomeStatement } from '@/types/income-statement'
import { AddIncomeStatementSchema } from '@/schema/income-statement'
import AddOrEditIncomeExpenseForScenario from '.'
import DeleteIncomeExpense from './DeleteIncomeExpense'

type EachIncomeForScenarioType = {
  incomeExpense: IncomeStatement
  createIncomeExpense: (dto: AddIncomeStatementSchema) => Promise<any>
  updateIncomeExpense: (id: number, dto: Partial<AddIncomeStatementSchema>) => Promise<any>
  deleteIncomeExpense: (id: number) => Promise<any>
}

const EachIncomeExpenseForScenario = ({
  incomeExpense,
  createIncomeExpense,
  updateIncomeExpense,
  deleteIncomeExpense,
}: EachIncomeForScenarioType) => {
  return (
    <div className={'border flex flex-col rounded-lg bg-blue-500'}>
      <div className='flex justify-between'>
        <p className='p-2 text-white text-xs'>Expense</p>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className='hover:bg-blue-600'>
                <MoreVerticalIcon className='text-white' size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col'>
              <DropdownMenuItem asChild>
                <AddOrEditIncomeExpenseForScenario
                  trigger={<Button variant={'ghost'}>Edit</Button>}
                  type='EXPENSE'
                  incomeStatement={incomeExpense}
                  createMutationFn={createIncomeExpense}
                  updateMutationFn={updateIncomeExpense}
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteIncomeExpense id={incomeExpense.id} deleteIncomeExpense={deleteIncomeExpense} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex flex-col items-center text-white'>
        <p>{incomeExpense.amount}</p>
        <p className='mt-5'>{incomeExpense.name}</p>
      </div>
    </div>
  )
}

export default EachIncomeExpenseForScenario
