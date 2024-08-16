import React from 'react'
import { Button } from '@/components/ui/button'
import { useStepper } from '@/components/ui/stepper'
import { AddGoalSchema } from '@/schema/goals'

type StepperFooterType = {
  isEdit: boolean
  values: AddGoalSchema
  handleCreate: () => void
  isLoading: boolean
  isError: boolean
}

const StepFooter = ({ isEdit, values, handleCreate, isLoading, isError }: StepperFooterType) => {
  const { nextStep, prevStep, isLastStep, isDisabledStep, hasCompletedAllSteps, currentStep } = useStepper()

  const FinishLabel = isEdit ? 'Edit' : 'Create'

  const disableNext = () => {
    if (currentStep?.id === '1') {
      if (values.name && values.goal_proportionality && values.target_date) {
        return false
      }
      return true
    } else if (currentStep?.id === '2') {
      if (values.custom_kpi || values.track_kpi) {
        return false
      }
      return true
    }
    return true
  }

  const disableCreate = () => {
    if (values.target_value) {
      return false
    }
    return true
  }

  const shouldDisable = () => {
    if (isLastStep) {
      return disableCreate()
    } else {
      return disableNext()
    }
  }

  const handleNext = () => {
    if (isLastStep) {
      handleCreate()
    }
    nextStep()
  }

  if (isError && hasCompletedAllSteps) {
    return (
      <div>
        <p className='py-5 text-gray-500'>Something went wrong.</p>
        <Button onClick={prevStep} type='button'>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <>
      {hasCompletedAllSteps ? <p className='p-5 text-gray-500'>In Progress...</p> : <></>}
      <div className='w-full flex justify-end gap-5'>
        <Button disabled={isDisabledStep} onClick={prevStep} size='sm' variant='secondary' type='button'>
          Prev
        </Button>
        <Button size='sm' onClick={handleNext} disabled={shouldDisable()} type='button' loading={isLoading}>
          {isLastStep || hasCompletedAllSteps ? FinishLabel : 'Next'}
        </Button>
      </div>
    </>
  )
}

export { StepFooter }
