import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import EditGoal from '../AddEditGoalPages/EditGoal'
import { getSearchParamFromLocationSearch } from '@/utils/utils'

const EditGoalDialog = ({ goalId, goal }: any) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [goalValues, setGoal] = useState(goal)
  const [goalIdValue, setGoalId] = useState(goalId)
  const location = useLocation()

  useEffect(() => {
    if (location.search) {
      const values: any = getSearchParamFromLocationSearch(location.search)
      if (values.edit_goal === 'true') {
        setGoal({ ...values })
        setIsDialogOpen(true)
        setGoalId(values.goal_id)
      }
    }
  }, [location.search])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger
        asChild
        onClick={() => {
          setIsDialogOpen(true)
        }}
      >
        <Button variant={'ghost'}>Edit Goal</Button>
      </DialogTrigger>
      <DialogContent className='min-w-auto'>
        <DialogHeader>
          <div className='flex gap-4'>
            <h1 className='self-center text-lg font-semibold leading-none tracking-tight'>Edit Goal</h1>
          </div>
        </DialogHeader>
        <EditGoal setIsDialogOpen={setIsDialogOpen} goalId={goalIdValue} goal={goalValues} />
      </DialogContent>
    </Dialog>
  )
}

export { EditGoalDialog }
