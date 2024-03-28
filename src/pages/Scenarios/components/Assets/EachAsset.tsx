import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import AddOrEditAssetsForScenarios from './AddOrEditAssetsForScenarios'
import DeleteAssetForScenario from './DeleteAssetForScenario'
import { PhysicalAsset } from '@/types/balance-sheet'
import { AddPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'

type EachIncomeForScenarioType = {
  asset: PhysicalAsset
  createAsset: (dto: AddPhysicalAssetSchemaForScenario) => Promise<any>
  updateAsset: (id: number, dto: Partial<AddPhysicalAssetSchemaForScenario>) => Promise<any>
  deleteAsset: (id: number) => Promise<any>
}

const EachIncomeExpenseForScenario = ({ asset, createAsset, updateAsset, deleteAsset }: EachIncomeForScenarioType) => {
  return (
    <div className={'border flex flex-col rounded-lg bg-green-500'}>
      <div className='flex justify-between'>
        <p className='p-2 text-white text-xs'>Asset</p>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className='hover:bg-green-600'>
                <MoreVerticalIcon className='text-white' size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col'>
              <DropdownMenuItem asChild>
                <AddOrEditAssetsForScenarios
                  trigger={<Button variant={'ghost'}>Edit</Button>}
                  asset={asset}
                  addAsset={createAsset}
                  editAsset={updateAsset}
                />
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <DeleteAssetForScenario id={asset.id} deleteAsset={deleteAsset} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='flex flex-col items-center text-white'>
        <p>{asset.market_value}</p>
        <p className='mt-5'>{asset.name}</p>
      </div>
    </div>
  )
}

export default EachIncomeExpenseForScenario
