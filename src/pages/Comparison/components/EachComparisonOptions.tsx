import React from 'react'
import { MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import DeleteComparison from './DeleteComparison'

type GoalOptionsType = {
  id: number
  handleAllowRename: () => void
  handleAccessChange: () => void
  access: string
}

const GoalOptions = ({ id, handleAllowRename, access, handleAccessChange }: GoalOptionsType) => {
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
            <Link
              to={`/comparisons/edit/${id}`}
              className='w-full hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium'
            >
              Edit
            </Link>
            <DeleteComparison id={id} />
            <Button
              className='w-full bg-transparent hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium text-black'
              onClick={handleAllowRename}
            >
              Rename
            </Button>
            <Button
              className='w-full bg-transparent hover:bg-accent flex justify-center p-2 rounded-lg text-sm font-medium text-black'
              onClick={handleAccessChange}
            >
              {access === 'Private' ? 'Set to public' : 'Set to private'}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default GoalOptions
