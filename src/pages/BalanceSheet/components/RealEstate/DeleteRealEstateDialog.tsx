import React from 'react'
import { TrashIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'
import { deleteCashAsset } from '@/queries/balance-sheet'

type Props = {
  id: number
}

export default function DeleteRealEstateDialog({ id }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const deleteCashMutation = useMutation({
    mutationFn: deleteCashAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.CASH] })
      toast({ title: 'Cash deleted successfully!' })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  return (
    <Alert
      trigger={
        <Button size='sm' variant='ghost'>
          <TrashIcon className='w-4 h-4 text-red-500' />
        </Button>
      }
      title='Delete Cash'
      description='Are you sure you want to delete this cash?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: deleteCashMutation.isPending, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: deleteCashMutation.isPending }}
      onOk={() => {
        deleteCashMutation.mutate(id)
      }}
    />
  )
}
