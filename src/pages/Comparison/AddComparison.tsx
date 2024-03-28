import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Page from '@/components/Page/Page'
import PageTitle from './components/PageTitle'
import { AddComaprisonSchema, addComparisonSchema } from '@/schema/comparisons'
import ComparisonForm from './components/Form'
import { createComparisons } from '@/queries/comparisons'
import { toast } from '@/components/ui/use-toast'

const AddComparison = () => {
  const navigate = useNavigate()
  const form = useForm<AddComaprisonSchema>({
    resolver: zodResolver(addComparisonSchema),
  })

  const { mutate, isLoading } = useMutation(createComparisons, {
    onSuccess: () => {
      toast({ title: 'Comparison created successfully' })
      navigate('/comparisons')
    },
    onError: (response: any) => {
      const message = response?.response?.data?.message
      message && toast({ title: message })
    },
  })

  const handleSubmit = (values: AddComaprisonSchema) => {
    mutate(values)
  }

  return (
    <Page className='space-y-8'>
      <PageTitle title='Create a comparison' backUrl='/comparisons' backUrlTitle='Back to Comparisons' />
      <ComparisonForm form={form} onSubmit={handleSubmit} isLoading={isLoading} />
    </Page>
  )
}

export default AddComparison
