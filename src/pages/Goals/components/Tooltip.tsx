import React, { useState } from 'react'
import { InfoIcon } from 'lucide-react'
import { TooltipTrigger, TooltipProvider, TooltipContent, Tooltip } from '@/components/ui/tooltip'

type TooltipForGoalsType = {
  iconSize?: 'default' | 'small'
  children: React.ReactNode
  side?: 'bottom' | 'top' | 'right' | 'left' | undefined
}

const TooltipForGoals = ({ iconSize, children, side = 'bottom' }: TooltipForGoalsType) => {
  const [isGoalInfoPopOverOpen, setIsGoalInfoPopOverOpen] = useState(false)
  return (
    <TooltipProvider>
      <Tooltip open={isGoalInfoPopOverOpen}>
        <TooltipTrigger asChild>
          <p className='text-sm underline hover:cursor-pointer'>
            <InfoIcon
              size={iconSize === 'small' ? 15 : 20}
              onMouseEnter={() => setIsGoalInfoPopOverOpen(true)}
              onMouseLeave={() => setIsGoalInfoPopOverOpen(false)}
            />
          </p>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          avoidCollisions
          align='start'
          sideOffset={0}
          onMouseEnter={() => setIsGoalInfoPopOverOpen(true)}
          onMouseLeave={() => setIsGoalInfoPopOverOpen(false)}
          collisionBoundary={[]}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { TooltipForGoals }
