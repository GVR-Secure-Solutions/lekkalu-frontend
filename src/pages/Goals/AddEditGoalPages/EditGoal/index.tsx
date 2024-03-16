import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { range } from 'lodash'
import Page from '@/components/Page/Page'
import { addGoalSchema, AddGoalSchema } from '@/schema/goals'
import { GOALS } from '@/utils/query-keys'
import { editGoal, fetchGoalDetails } from '@/queries/goals'
import { useToast } from '@/components/ui/use-toast'
import { Goal } from '@/types/goals'
import { Skeleton } from '@/components/ui/skeleton'
import Form from '@/pages/Goals/AddEditGoalPages/components/Form'

export default function EditGoal() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { id } = useParams() as { id: string }
  const goalId = Number(id)
  const QUERY_NAME = `${GOALS.GOAL}-${goalId}`

  const { data: goal, isLoading: isFetchingGoal } = useQuery([QUERY_NAME], () => fetchGoalDetails(goalId), {
    onError: () => {
      toast({ title: 'Something went wrong.' })
    },
  })
  const editGoalMutation = useMutation((dto: Partial<Goal>) => editGoal(goalId, dto), {
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_NAME])
      toast({ title: 'Goal edited successfully!' })
      navigate('/goals')
    },
  })

  const form = useForm<AddGoalSchema>({
    resolver: zodResolver(addGoalSchema),
  })

  useEffect(() => {
    if (!isFetchingGoal && goal) {
      form.setValue('name', goal?.name)
      form.setValue('target_date', goal?.target_date)
      form.setValue('target_value', goal?.target_value)
      form.setValue('goal_proportionality', goal?.goal_proportionality)
      form.setValue('track_kpi', goal?.track_kpi)
      form.setValue('target_contribution_source', goal?.target_contribution_source)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goal, isFetchingGoal])

  const handleGoalEdit = (values: AddGoalSchema) => {
    editGoalMutation.mutate(values)
  }

  return (
    <Page className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold'>{isFetchingGoal ? 'Loading...' : `Edit ${goal?.name}`}</h1>
        <div className='w-full h-[1px] bg-gray-200 my-2' />
      </div>
      <div>
        <Link className='flex w-[150px] items-center gap-2 text-muted-foreground' to='/goals'>
          <ArrowLeftIcon className='w-4 h-4' />
          Back to Goals
        </Link>
      </div>
      {isFetchingGoal ? (
        <div className='grid md:grid-cols-2 gap-4 items-center'>
          {range(6).map((i) => (
            <Skeleton key={i} className='w-full h-[50px]' />
          ))}
          <Skeleton className='w-20 h-[50px]' />
        </div>
      ) : (
        <Form form={form} onSubmit={handleGoalEdit} isLoading={editGoalMutation.isLoading} isEdit />
      )}
    </Page>
  )
}
