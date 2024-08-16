import React from 'react'
import { MoreVertical } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import DeleteGoal from './DeleteGoal'
import { Button } from '@/components/ui/button'
import { Goal } from '@/types/goals'
import { EditGoalDialog } from './EditGoalDialog'

type GoalOptionsType = {
  id: number
  handleAllowRename: () => void
  goal: Goal
}

const GoalOptions = ({ id, handleAllowRename, goal }: GoalOptionsType) => {
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
            <EditGoalDialog goalId={id} goal={goal} />
            <DeleteGoal id={id} />
            <Button
              className='w-full bg-transparent hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium text-black'
              onClick={handleAllowRename}
            >
              Rename
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default GoalOptions
