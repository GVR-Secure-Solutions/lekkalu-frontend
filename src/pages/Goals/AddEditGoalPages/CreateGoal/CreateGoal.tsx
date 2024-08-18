import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import { AddGoalSchema, addGoalSchema } from '@/schema/goals'
import { addGoal } from '@/queries/goals'
import { useToast } from '@/components/ui/use-toast'
import Form from '../components/Form'
import { GOALS } from '@/utils/query-keys'
import { getCorrectType, getSearchParamFromLocationSearch } from '@/utils/utils'

type CreateGoalType = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateGoal({ setIsDialogOpen }: CreateGoalType) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const location = useLocation()
  const form = useForm<AddGoalSchema>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      target_date: dayjs().format('YYYY-MM-DD'),
    },
  })

  useEffect(() => {
    const values: any = getSearchParamFromLocationSearch(location.search)
    if (Object.keys(values).length) {
      Object.keys(values).forEach((each: any) => {
        form.setValue(each, getCorrectType(values[each]))
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const createGoalMutation = useMutation({
    mutationFn: addGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOALS.GOALS] })
      toast({ title: 'Goal created successfully!' })
      setIsDialogOpen(false)
    },
    onError: (response: any) => {
      const message = response?.response?.data?.message
      message && toast({ title: message })
    },
  })

  const handleGoalCreate = (values: AddGoalSchema) => {
    createGoalMutation.mutate({ ...values, track_kpi: values.track_kpi ?? 'LiabilityPercent' })
  }

  return (
    <Form
      form={form}
      onSubmit={handleGoalCreate}
      isLoading={createGoalMutation.isPending}
      isError={createGoalMutation?.isError}
    />
  )
}
