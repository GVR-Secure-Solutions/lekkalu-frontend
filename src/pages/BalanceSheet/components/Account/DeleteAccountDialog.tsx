import React from 'react'
import { TrashIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'
import { deleteAccountAsset } from '@/queries/balance-sheet'

type Props = {
  id: number
}

export default function DeleteAccountDialog({ id }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccountAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ACCOUNT] })
      toast({ title: 'Account deleted successfully!' })
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
      title='Delete Account'
      description='Are you sure you want to delete this account?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: deleteAccountMutation.isPending, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: deleteAccountMutation.isPending }}
      onOk={() => {
        deleteAccountMutation.mutate(id)
      }}
    />
  )
}
