import React from 'react'
import { TrashIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { deletePhysicalAsset } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  id: number[]
  forMultiple?: boolean
}

export default function DeleteAssetDialog({ id, forMultiple }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()

  const deleteAssetMutation = useMutation({
    mutationFn: deletePhysicalAsset,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [BALANCE_SHEET.ASSETS] })
      toast({ title: 'Asset deleted successfully!' })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  return (
    <Alert
      trigger={
        <Button
          size={forMultiple ? 'default' : 'sm'}
          variant={forMultiple ? 'default' : 'ghost'}
          className={forMultiple ? 'ml-5 bg-red-500 hover:bg-red-400' : ''}
        >
          <TrashIcon className={`w-4 h-4 ${forMultiple ? 'text-white' : 'text-red-500'}`} />
        </Button>
      }
      title='Delete Asset'
      description={
        forMultiple ? 'Are you sure you want to delete selected assets?' : 'Are you sure you want to delete this asset?'
      }
      okText='Yes, Delete'
      okButtonProps={{ disabled: deleteAssetMutation.isPending, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: deleteAssetMutation.isPending }}
      onOk={() => {
        if (id.length > 1) {
          console.log('how to handle this? Ask backend!!')
          return
        }
        deleteAssetMutation.mutate(id[0])
      }}
    />
  )
}
