import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import EditGoal from '../AddEditGoalPages/EditGoal'

const EditGoalDialog = ({ goalId, goal }: any) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
        <EditGoal setIsDialogOpen={setIsDialogOpen} goalId={goalId} goal={goal} />
      </DialogContent>
    </Dialog>
  )
}

export { EditGoalDialog }
