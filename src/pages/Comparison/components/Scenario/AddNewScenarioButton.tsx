import React from 'react'
import { CheckCircle2, Circle, PlusCircleIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DialogPortal,
  Dialog,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Scenario as ScenarioType } from '@/types/scenarios'

type AddNewScenarioButtonType = {
  handleAddScenariosToComparison: () => void
  scenarios: ScenarioType[]
  isSelected: (id: number) => boolean
  comparisonName: string
  handleScenarioSelect: (id: number) => void
}

const AddNewScenarioButton = ({
  handleAddScenariosToComparison,
  scenarios,
  isSelected,
  comparisonName,
  handleScenarioSelect,
}: AddNewScenarioButtonType) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='border Button violet border-dashed p-5 rounded flex flex-col space-y-5 justify-center items-center hover:cursor-pointer h-full'>
          <PlusCircleIcon size={50} className='text-gray-600' />
          <span className='text-sm text-center text-gray-600'>Add scenario </span>
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogOverlay className='DialogOverlay' />
        <DialogContent className='DialogContent min-w-[80vw] min-h-[80vh]'>
          <DialogTitle className='DialogTitle'>Scenarios</DialogTitle>
          <DialogDescription className='DialogDescription'>
            <div className='flex justify-between'>
              <p>{`Add Scenarios to ${comparisonName}`}</p>
              <Link to='/scenarios/new' className='hover:underline text-primary'>
                Create a new scenario
              </Link>
            </div>
          </DialogDescription>
          <div className='flex flex-col gap-5 h-[550px] overflow-y-auto px-5'>
            {scenarios.length ? (
              scenarios?.map((each: any) => {
                const selected = isSelected(each?.id)
                return (
                  <div
                    key={each?.id}
                    className={`flex border rounded p-2 space-x-5 hover:cursor-pointer ${
                      selected ? 'bg-blue-500 text-white' : ''
                    }`}
                    onClick={() => handleScenarioSelect(each?.id)}
                  >
                    <div className='my-auto'>{selected ? <CheckCircle2 /> : <Circle />}</div>
                    <div>{each?.name}</div>
                  </div>
                )
              })
            ) : (
              <div className='h-full flex flex-col justify-center items-center gap-5'>
                <div>
                  <p>No Scenarios left to add</p>
                </div>
                <div>
                  <Link to='/scenarios/new' className='hover:underline text-primary'>
                    Create a scenario
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
            <DialogClose asChild>
              <Button disabled={!scenarios.length} onClick={handleAddScenariosToComparison}>
                Add
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default AddNewScenarioButton
