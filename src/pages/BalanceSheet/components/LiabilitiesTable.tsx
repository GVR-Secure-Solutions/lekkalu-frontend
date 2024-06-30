import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { LoaderIcon, PencilIcon, PlusIcon } from 'lucide-react'
import { fetchLiabilities } from '@/queries/balance-sheet'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AddOrEditLiabilityDialog from './AddOrEditLiabilityDialog'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import DeleteLiabilityDialog from './DeleteLiabilityDialog'
import { formatIndianMoneyNotation } from '@/utils/format-money'

export default function LiabilitiesTable() {
  const { data, isFetching } = useQuery({ queryKey: [BALANCE_SHEET.LIABILITIES], queryFn: fetchLiabilities })

  return (
    <div className='space-y-2'>
      <div className='flex justify-end'>
        <AddOrEditLiabilityDialog
          trigger={
            <Button>
              <PlusIcon className='mr-2 w-4 h-4' />
              <span>Add Liability</span>
            </Button>
          }
        />
      </div>

      <Table className='border rounded'>
        <TableCaption className='text-center'>A list of liabilities</TableCaption>
        <TableHeader className='bg-gray-100/50'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Market Value</TableHead>
            <TableHead>Principal</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Tenure</TableHead>
            <TableHead>Closure</TableHead>
            <TableHead>Disbursement</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='relative'>
          <When truthy={isFetching}>
            <div className='absolute inset-0 flex items-center justify-center bg-background/80'>
              <LoaderIcon className='animate-spin w-4 h-4' />
            </div>
          </When>

          {data?.map((liability) => (
            <TableRow key={liability.id}>
              <TableCell>{liability.name}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Number(liability.balance))}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Number(liability.principal))}</TableCell>
              <TableCell>{liability.interest_rate}</TableCell>
              <TableCell>{liability.tenure}</TableCell>
              <TableCell>{formatIndianMoneyNotation(Number(liability.closure_charges))}</TableCell>
              <TableCell>{liability.disbursement_date}</TableCell>
              <TableCell className='space-x-2'>
                <AddOrEditLiabilityDialog
                  liability={liability}
                  trigger={
                    <Button size='sm' variant='outline'>
                      <PencilIcon className='w-4 h-4' />
                    </Button>
                  }
                />

                <DeleteLiabilityDialog id={liability.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
