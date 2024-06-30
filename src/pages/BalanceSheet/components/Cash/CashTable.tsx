import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { LoaderIcon, PencilIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import AddOrEditAssetsCash from './AddOrEditAssetsCash'
import DeleteCashDialog from './DeleteCashDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { AddCashType } from '@/types/balance-sheet'

export default function CashTable({
  queryData: { data, isLoading },
}: {
  queryData: UseQueryResult<AddCashType[], unknown>
}) {
  return (
    <div className='space-y-2'>
      <Table className='border rounded'>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isLoading}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {data?.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{formatIndianMoneyNotation(asset.balance)}</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditAssetsCash
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-5' />
                    </Button>
                  }
                  asset={asset}
                />

                <DeleteCashDialog id={Number(asset.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
