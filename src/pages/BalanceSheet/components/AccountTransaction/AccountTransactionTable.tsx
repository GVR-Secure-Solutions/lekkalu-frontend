import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon, PencilIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AccountSchema } from '@/types/balance-sheet'
import DeleteAccountDialog from './DeleteAccountTransactionDialog'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import AddOrEditAssetsAccountTransaction from './AddOrEditAssetsAccountTransaction'
import { fetchAccountTransactionAssets } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import When from '@/components/When/When'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export default function AccountTransactionTable({ isOpen, asset }: { isOpen: boolean; asset: AccountSchema }) {
  const { data, isLoading } = useQuery({
    queryKey: [BALANCE_SHEET.ACCOUNT_TRANSACTIONS],
    queryFn: fetchAccountTransactionAssets,
  })
  const transactions = useMemo(() => (data ? data?.filter((ele) => ele.account === asset.id) : []), [asset, data])
  return (
    <Collapsible open={isOpen} asChild>
      <CollapsibleContent asChild>
        <>
          <When truthy={isLoading}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>
          {transactions.length > 0 ? (
            transactions.map((ele) => (
              <TableRow
                key={ele.id}
                className={ele.amount < 0 ? 'bg-red-200 hover:bg-red-300' : 'bg-green-200 hover:bg-green-300'}
              >
                <TableCell>{formatIndianMoneyNotation(ele.amount)}</TableCell>
                <TableCell>{dayjs(ele.time).format('ddd MMM DD, YYYY')}</TableCell>
                <TableCell className='space-x-2'>
                  <AddOrEditAssetsAccountTransaction
                    trigger={
                      <Button size='sm' variant='outline'>
                        <PencilIcon className='w-4 h-5' />
                      </Button>
                    }
                    asset={ele}
                  />

                  <DeleteAccountDialog id={Number(ele.id)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>No Transaction Found</TableCell>
            </TableRow>
          )}
        </>
      </CollapsibleContent>
    </Collapsible>
  )
}
