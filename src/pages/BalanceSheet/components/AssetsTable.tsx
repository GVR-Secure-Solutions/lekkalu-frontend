import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { LoaderIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { fetchPhysicalAssets } from '@/queries/balance-sheet'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AddOrEditAssetDialog from './AddOrEditAssetDialog'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import DeleteAssetDialog from './DeleteAssetDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export default function AssetsTable() {
  const { data, isFetching } = useQuery([BALANCE_SHEET.ASSETS], fetchPhysicalAssets)

  return (
    <div className='space-y-2'>
      <div className='flex justify-end'>
        <AddOrEditAssetDialog
          trigger={
            <Button>
              <PlusIcon className='mr-2 w-4 h-4' />
              <span>Add Asset</span>
            </Button>
          }
        />
      </div>

      <Table className='border rounded'>
        <TableCaption className='text-center'>A list of physical assets</TableCaption>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Purchase Value</TableHead>
            <TableHead>Sell Value</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isFetching}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {data?.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{formatIndianMoneyNotation(parseFloat(asset.market_value))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(parseFloat(asset.purchase_value))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(parseFloat(asset.sell_value) ?? 0)}</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditAssetDialog
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-5' />
                    </Button>
                  }
                  asset={asset}
                />

                <DeleteAssetDialog id={asset.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
