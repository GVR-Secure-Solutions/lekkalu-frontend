import React from 'react'
import { PlusIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import AddOrEditAssetDialog from './AddOrEditAssetDialog'
import { Button } from '@/components/ui/button'
import CashTable from './Cash/CashTable'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BALANCE_SHEET } from '@/utils/query-keys'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { formatIndianMoneyNotation } from '@/utils/format-money'
import PhysicalAssetTable from './PhysicalAsset/PhysicalAssetTable'
import {
  fetchAccountAssets,
  fetchCashAsset,
  fetchPhysicalAssets,
  fetchSecurityTransaction,
} from '@/queries/balance-sheet'
import MutualFundTable from './MutualFund/MutualFundTable'
import AccountTable from './Account/AccountTable'
import AddOrEditAssetsAccountTransaction from './AccountTransaction/AddOrEditAssetsAccountTransaction'

export default function AssetsTable() {
  const cashQueryData = useQuery({ queryKey: [BALANCE_SHEET.CASH], queryFn: fetchCashAsset })
  const physicalAssetsQueryData = useQuery({ queryKey: [BALANCE_SHEET.ASSETS], queryFn: fetchPhysicalAssets })
  const mutualFundQueryData = useQuery({
    queryKey: [BALANCE_SHEET.SECURITIES_TRANSACTIONS],
    queryFn: fetchSecurityTransaction,
  })
  const accountQueryData = useQuery({ queryKey: [BALANCE_SHEET.ACCOUNT], queryFn: fetchAccountAssets })
  const { preferences } = useUserPreferences()

  return (
    <div className='space-y-2'>
      <div className='flex gap-3 justify-end'>
        <AddOrEditAssetsAccountTransaction
          trigger={
            <Button>
              <PlusIcon className='mr-2 w-4 h-4' />
              <span>Account Transaction</span>
            </Button>
          }
        />

        <AddOrEditAssetDialog
          trigger={
            <Button>
              <PlusIcon className='mr-2 w-4 h-4' />
              <span>Add Asset</span>
            </Button>
          }
        />
      </div>

      <Accordion type='single' collapsible className='w-full'>
        <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='cash'>
          <AccordionTrigger className='text-lg'>
            <div>Cash</div>
            <div className='me-4'>
              {cashQueryData.data &&
                formatIndianMoneyNotation(
                  cashQueryData.data.reduce(
                    (totalBalance, asset) => totalBalance + parseFloat(asset.balance as any),
                    0,
                  ),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <CashTable queryData={cashQueryData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='account'>
          <AccordionTrigger className='text-lg'>
            <div>Account</div>
            <div className='me-4'>
              {accountQueryData.data &&
                formatIndianMoneyNotation(
                  accountQueryData.data.reduce((totalBalance, asset) => totalBalance + parseFloat(asset.balance), 0),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <AccountTable queryData={accountQueryData} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='mutual-funds'>
          <AccordionTrigger className='text-lg'>
            <div>Mutual Funds / Equity</div>
            <div className='me-4'>
              {mutualFundQueryData.data &&
                formatIndianMoneyNotation(
                  mutualFundQueryData.data.reduce(
                    (totalBalance, asset) => totalBalance + parseFloat(asset.value as any),
                    0,
                  ),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <MutualFundTable queryData={mutualFundQueryData} />
          </AccordionContent>
        </AccordionItem>
        {/* <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='gold'>
          <AccordionTrigger className='text-lg'>
            <div>Gold</div>
            <div className='me-4'>
              {mutualFundQueryData.data &&
                formatIndianMoneyNotation(
                  mutualFundQueryData.data.reduce(
                    (totalBalance, asset) => totalBalance + parseFloat(asset.value as any),
                    0,
                  ),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <GoldTable queryData={mutualFundQueryData as any} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='real-estate'>
          <AccordionTrigger className='text-lg'>
            <div>Real Estate</div>
            <div className='me-4'>
              {mutualFundQueryData.data &&
                formatIndianMoneyNotation(
                  mutualFundQueryData.data.reduce(
                    (totalBalance, asset) => totalBalance + parseFloat(asset.value as any),
                    0,
                  ),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <RealEstateTable queryData={mutualFundQueryData as any} />
          </AccordionContent>
        </AccordionItem> */}
        <AccordionItem className='bg-gray-100/50 px-3 rounded-md my-2' value='assets'>
          <AccordionTrigger className='text-lg'>
            <div>Physical Asset</div>
            <div className='me-4'>
              {physicalAssetsQueryData.data &&
                formatIndianMoneyNotation(
                  physicalAssetsQueryData.data.reduce(
                    (totalBalance, asset) => totalBalance + parseFloat(asset.purchase_value as any),
                    0,
                  ),
                )}{' '}
              {preferences.currencyUnit}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <PhysicalAssetTable queryData={physicalAssetsQueryData} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
