import React from 'react'
import { MoreVerticalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { AddLiabilitySchema, Liability } from '@/types/balance-sheet'
import AddOrEditLiabilityDialog from './AddorEditLiabilityDialog'
import DeleteLiabilityForScenario from './DeleteLiabilityForScenario'
import { formatIndianMoneyNotation } from '@/utils/format-money'

type EachLiabilityForScenarioType = {
  liability: Liability
  addLiability: (dto: AddLiabilitySchema) => Promise<any>
  editLiability: (id: number, dto: Partial<AddLiabilitySchema>) => Promise<any>
  deleteLiability: (id: number) => Promise<any>
  IS_AUTHENTICATED_USER?: boolean
}

const EachLiabilityForScenario = ({
  liability,
  addLiability,
  editLiability,
  deleteLiability,
  IS_AUTHENTICATED_USER,
}: EachLiabilityForScenarioType) => {
  return (
    <div className={'border flex flex-col rounded-lg bg-red-500 min-h-[150px] min-w-[150px]'}>
      <div className='flex justify-between'>
        <p className='p-2 text-white text-xs'>Liability</p>
        {IS_AUTHENTICATED_USER && (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className='hover:bg-red-600'>
                  <MoreVerticalIcon className='text-white' size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='flex flex-col'>
                <DropdownMenuItem asChild>
                  <AddOrEditLiabilityDialog
                    trigger={<Button variant={'ghost'}>Edit</Button>}
                    addLiability={addLiability}
                    editLiability={editLiability}
                    liability={liability}
                  />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <DeleteLiabilityForScenario id={liability.id} deleteLiability={deleteLiability} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center text-white'>
        <p>{formatIndianMoneyNotation(liability.principal)}</p>
        <p className='mt-5'>{liability.name}</p>
      </div>
    </div>
  )
}

export default EachLiabilityForScenario
