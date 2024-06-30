import React from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { LoaderIcon, PencilIcon } from 'lucide-react'
import dayjs from 'dayjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import DeletePhysicalAssetDialog from './DeletePhysicalAssetDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { PhysicalAsset } from '@/types/balance-sheet'
import AddOrEditAssetsPhysical from './AddOrEditAssetsPhysical'

export default function PhysicalAssetTable({
  queryData: { data, isLoading },
}: {
  queryData: UseQueryResult<PhysicalAsset[], unknown>
}) {
  return (
    <div className='space-y-2'>
      <Table className='border rounded'>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Purchase Value</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>Depreciation Percent</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isLoading}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {data?.map((asset: PhysicalAsset) => (
            <TableRow key={asset.id}>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{formatIndianMoneyNotation(asset.purchase_value ?? 0)}</TableCell>
              <TableCell>{dayjs(asset.purchase_date).format('MMM DD, YYYY')}</TableCell>
              <TableCell>{formatIndianMoneyNotation(asset.depreciation_percent_per_year ?? 0)}%</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditAssetsPhysical
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-5' />
                    </Button>
                  }
                  asset={asset}
                />

                <DeletePhysicalAssetDialog id={Number(asset.id)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
