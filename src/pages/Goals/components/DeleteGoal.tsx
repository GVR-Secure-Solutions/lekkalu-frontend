import React from 'react'
// import { TrashIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { deleteGoal } from '@/queries/goals'
import { GOALS } from '@/utils/query-keys'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  id: number
}

export default function DeleteGoal({ id }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [GOALS.GOALS] })
      toast({ title: 'Goal deleted successfully!' })
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
      title='Delete Goal'
      description='Are you sure you want to delete this goal ?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: deleteGoalMutation.isPending, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: deleteGoalMutation.isPending }}
      onOk={() => {
        deleteGoalMutation.mutate(id)
      }}
    />
  )
}
