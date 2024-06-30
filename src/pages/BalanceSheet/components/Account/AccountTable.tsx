import React, { useCallback, useState } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { ChevronDown, ChevronUp, LoaderIcon, PencilIcon } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import When from '@/components/When/When'
import AddOrEditAssetsAccount from './AddOrEditAssetsAccount'
import { AccountSchema } from '@/types/balance-sheet'
import DeleteAccountDialog from './DeleteAccountDialog'
import AccountTransactionTable from '../AccountTransaction/AccountTransactionTable'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import { Badge } from '@/components/ui/badge'

const ClickableTableRow = ({
  asset,
  handleSetActiveTab,
  activeTab,
}: {
  asset: AccountSchema
  handleSetActiveTab: (deps: string) => void
  activeTab: string[]
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCollapsible = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <TableRow
        className='cursor-pointer'
        onClick={() => {
          handleSetActiveTab(asset.id)
          toggleCollapsible()
        }}
      >
        <TableCell>
          <div className='flex items-center gap-2'>
            {activeTab.includes(asset.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            {asset.name}
          </div>
        </TableCell>
        <TableCell>
          <div className='flex items-center gap-2 cursor-pointer'>
            <Badge className={`${Number(asset.balance) < 0 ? 'bg-red-500' : 'bg-green-500'} h-3 w-3 p-0`} />
            {formatIndianMoneyNotation(asset.balance) || 'N/A'}
          </div>
        </TableCell>
        <TableCell className='space-x-2'>
          <AddOrEditAssetsAccount
            trigger={
              <Button size='sm' variant='outline'>
                <PencilIcon className='w-4 h-5' />
              </Button>
            }
            asset={asset}
          />

          <DeleteAccountDialog id={Number(asset.id)} />
        </TableCell>
      </TableRow>
      <AccountTransactionTable asset={asset} isOpen={isOpen} />
    </>
  )
}

export default function AccountTable({
  queryData: { data, isLoading },
}: {
  queryData: UseQueryResult<AccountSchema[], unknown>
}) {
  const [activeTab, setActiveTab] = React.useState<string[]>([])

  const handleSetActiveTab = useCallback((deps: string) => {
    setActiveTab((prevActiveTab) => {
      if (prevActiveTab.includes(deps)) {
        return prevActiveTab.filter((v) => v !== deps)
      } else {
        return [...prevActiveTab, deps]
      }
    })
  }, [])

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
            <ClickableTableRow
              handleSetActiveTab={handleSetActiveTab}
              activeTab={activeTab}
              asset={asset}
              key={asset.id}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
