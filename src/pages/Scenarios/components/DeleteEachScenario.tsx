import React from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Alert from '@/components/Alert/Alert'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { deleteScenario } from '@/queries/scenarios'
import { SCENARIOS } from '@/utils/query-keys'
import { getErrorMessage } from '@/utils/utils'

type Props = {
  id: number
}

export default function DeleteScenario({ id }: Props) {
  const qc = useQueryClient()
  const { toast } = useToast()
  const navigate = useNavigate()

  const deleteGoalMutation = useMutation(deleteScenario, {
    onSuccess: () => {
      qc.invalidateQueries([SCENARIOS.SCENARIOS])
      toast({ title: 'Scenario deleted successfully!' })
      navigate('/scenarios')
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const deleteScenarioMutation = (id: number) => {
    deleteGoalMutation.mutate(id)
  }

  return (
    <Alert
      trigger={
        <Button size='sm' variant='ghost' className='w-full text-red-500 hover:text-white hover:bg-red-500'>
          Delete
        </Button>
      }
      title='Delete Scenario'
      description='Are you sure you want to delete this scenario ?'
      okText='Yes, Delete'
      okButtonProps={{ disabled: false, className: 'bg-red-500 hover:bg-red-400' }}
      cancelText='No'
      cancelProps={{ disabled: false }}
      onOk={() => {
        deleteScenarioMutation(id)
      }}
    />
  )
}
