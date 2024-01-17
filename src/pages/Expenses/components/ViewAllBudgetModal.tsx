import React, { useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoaderIcon, TrashIcon } from 'lucide-react'
import { deleteBudget, fetchBudgets } from '@/queries/budget'
import { BUDGET_QUERY_KEYS } from '@/utils/query-keys'
import EditBudgetModal from './EditBudgetModal'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import When from '@/components/When/When'
import { getErrorMessage } from '@/utils/utils'
import { toast } from '@/components/ui/use-toast'
import { formatIndianMoneyNotation } from '@/utils/format-money'

dayjs.extend(customParseFormat)

export default function ViewAllBudgetModal() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const qc = useQueryClient()

  const { data, isFetching } = useQuery([BUDGET_QUERY_KEYS.BUDGETS], fetchBudgets, { enabled: !!open })
  const deleteBudgetMutation = useMutation(deleteBudget, {
    onSuccess: () => {
      qc.invalidateQueries([BUDGET_QUERY_KEYS.BUDGETS])
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        <Button variant='outline'>View All</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your list of budgets</DialogTitle>
        </DialogHeader>

        <Table className='border rounded'>
          <TableHeader className='bg-gray-100/50'>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <When truthy={isFetching}>
              <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
                <LoaderIcon className='animate-spin w-4 h-4' />
              </div>
            </When>

            {data?.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell>{dayjs(budget.month, 'YYYY-MM-DD').format('MMMM YYYY')}</TableCell>
                <TableCell>{formatIndianMoneyNotation(parseFloat(budget.limit))}</TableCell>
                <TableCell className='flex items-center gap-2'>
                  <Button loading={deleteBudgetMutation.isLoading} variant='ghost' size='sm'>
                    <TrashIcon
                      className='w-4 h-4 text-red-500'
                      onClick={() => {
                        deleteBudgetMutation.mutate(budget.id)
                      }}
                    />
                  </Button>

                  <EditBudgetModal budget={budget} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}
