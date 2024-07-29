import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AddGoalSchema, addGoalSchema } from '@/schema/goals'
import { addGoal } from '@/queries/goals'
import { useToast } from '@/components/ui/use-toast'
import Form from '../components/Form'
import { GOALS } from '@/utils/query-keys'

type CreateGoalType = {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CreateGoal({ setIsDialogOpen }: CreateGoalType) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const form = useForm<AddGoalSchema>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      target_date: dayjs().format('YYYY-MM-DD'),
    },
  })

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
    createGoalMutation.mutate(values)
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
