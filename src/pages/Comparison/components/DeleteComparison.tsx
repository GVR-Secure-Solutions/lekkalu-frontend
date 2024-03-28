import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { COMPARISON } from '@/utils/query-keys'
import { getErrorMessage } from '@/utils/utils'
import { deleteComparisons } from '@/queries/comparisons'

type Props = {
  id: number
}

export default function DeleteComparison({ id }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const deleteComparisonMutation = useMutation(deleteComparisons, {
    onSuccess: () => {
      qc.invalidateQueries([COMPARISON.COMPARISON])
      toast({ title: 'Comparison deleted successfully!' })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const handleDelete = (id: number) => {
    deleteComparisonMutation.mutate(id)
  }

  return (
    <Alert
      trigger={
        <Button size='sm' variant='ghost' className='w-full text-red-500 hover:text-white hover:bg-red-500'>
          Delete
        </Button>
      }
      title='Delete Comparison'
      description='Are you sure you want to delete this comparison ?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: false, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: false }}
      onOk={() => {
        handleDelete(id)
      }}
    />
  )
}
