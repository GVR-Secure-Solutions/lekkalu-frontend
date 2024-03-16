import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import Page from '@/components/Page/Page'
import { AddGoalSchema, addGoalSchema } from '@/schema/goals'
import { addGoal } from '@/queries/goals'
import { useToast } from '@/components/ui/use-toast'
import Form from '../components/Form'

export default function CreateGoal() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const form = useForm<AddGoalSchema>({
    resolver: zodResolver(addGoalSchema),
    defaultValues: {
      target_date: dayjs().format('YYYY-MM-DD'),
    },
  })

  const createGoalMutation = useMutation(addGoal, {
    onSuccess: () => {
      toast({ title: 'Goal created successfully!' })
      navigate('/goals')
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
    <Page className='space-y-8'>
      <div>
        <h1 className='text-2xl font-bold'>Create a new goal</h1>
        <div className='w-full h-[1px] bg-gray-200 my-2' />
      </div>
      <Link className='flex items-center gap-2 text-muted-foreground' to='/goals'>
        <ArrowLeftIcon className='w-4 h-4' />
        Back to Goals
      </Link>
      <Form form={form} onSubmit={handleGoalCreate} isLoading={createGoalMutation.isLoading} />
    </Page>
  )
}
