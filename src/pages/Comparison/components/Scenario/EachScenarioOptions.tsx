import React from 'react'
import { MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

import { Button } from '@/components/ui/button'

type GoalOptionsType = {
  id: number
  handleRemoveScenario: (id: number) => void
}

const ScenarioOption = ({ id, handleRemoveScenario }: GoalOptionsType) => {
  return (
    <div className='flex w-full justify-end gap-x-2'>
      <Popover>
        <PopoverTrigger>
          <div className='border p-3 rounded hover:bg-accent ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
            <MoreVertical size={16} />
          </div>
        </PopoverTrigger>
        <PopoverContent className='w-[200px]'>
          <div className='flex flex-col'>
            <Button
              className='w-full bg-transparent hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium text-black'
              onClick={() => handleRemoveScenario(id)}
            >
              Remove
            </Button>
            <Link
              to={`/scenario/${id}`}
              className='w-full hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium'
            >
              View Detail
            </Link>
            <Link
              to={`/scenario/edit/${id}`}
              className='w-full hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium'
            >
              Edit Scenario
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ScenarioOption
