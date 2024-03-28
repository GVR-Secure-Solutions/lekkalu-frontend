import React from 'react'
// import { TrashIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { AUTH, INCOME_STATEMENT } from '@/utils/query-keys'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  id: number
  deleteIncomeExpense: (id: number) => Promise<any>
}

export default function DeleteIncomeExpense({ id, deleteIncomeExpense }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const { data: username } = useQuery<string>([AUTH.CURRENT_IMAGINARY_USER])

  const deleteMutation = useMutation(deleteIncomeExpense, {
    onSuccess: () => {
      qc.invalidateQueries([`${INCOME_STATEMENT.IS_EXPENSES}-${username}`])
      toast({ title: 'Montly Income Expense deleted successfully!' })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  return (
    <Alert
      trigger={
        <Button size='sm' variant='ghost' className='w-full text-red-500 hover:text-white hover:bg-red-500'>
          Delete
        </Button>
      }
      title='Delete Monthly Expense'
      description='Are you sure you want to delete this Monthly Expense ?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: deleteMutation.isLoading, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: deleteMutation.isLoading }}
      onOk={() => {
        deleteMutation.mutate(id)
      }}
    />
  )
}
