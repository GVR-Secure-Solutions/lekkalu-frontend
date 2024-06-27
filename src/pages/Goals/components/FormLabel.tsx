import React from 'react'
import { FormLabel } from '@/components/ui/form'
import { TooltipForGoals } from './Tooltip'

type FormLabelForGoalFormType = {
  label: string
  info?: string
  required?: boolean
  example?: string
  tooltipSide?: 'bottom' | 'top' | 'right' | 'left' | undefined
}

const FormLabelForGoalForm = ({ label, info, required, example, tooltipSide = 'bottom' }: FormLabelForGoalFormType) => {
  return (
    <FormLabel>
      <div className='flex gap-2'>
        <p className='self-center'>
          {label}
          {required ? '*' : ''}
        </p>
        {info && (
          <TooltipForGoals iconSize={'small'} side={tooltipSide}>
            <div className='p-2 max-w-[230px] font-normal'>
              <p>{info}</p>
              {example && (
                <div className='font-medium mt-2'>
                  <p>
                    <span>Example: </span>
                    <span>{example}</span>
                  </p>
                </div>
              )}
            </div>
          </TooltipForGoals>
        )}
      </div>
    </FormLabel>
  )
}

export { FormLabelForGoalForm }
