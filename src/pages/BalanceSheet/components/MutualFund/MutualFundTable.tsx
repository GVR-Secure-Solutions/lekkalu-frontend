import React from 'react'
import dayjs from 'dayjs'
import { UseQueryResult } from '@tanstack/react-query'
import { LoaderIcon, PencilIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import AddOrEditAssetsMutualFund from './AddOrEditAssetsMutualFund'
import DeleteMutualFundDialog from './DeleteMutualFundDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { MutualFundSchema } from '@/types/balance-sheet'

export default function MutualFundTable({
  queryData: { data, isLoading },
}: {
  queryData: UseQueryResult<MutualFundSchema[], unknown>
}) {
  return (
    <div className='space-y-2'>
      <Table className='border rounded'>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Transaction Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell>{asset.type}</TableCell>
              <TableCell>{formatIndianMoneyNotation(asset.value)}</TableCell>
              <TableCell>{dayjs(asset.transaction_date).format('MMM DD, YYYY')}</TableCell>
              <TableCell>{formatIndianMoneyNotation(asset.quantity, 2)}</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditAssetsMutualFund
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-5' />
                    </Button>
                  }
                  asset={asset}
                />

                <DeleteMutualFundDialog id={Number(asset.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
