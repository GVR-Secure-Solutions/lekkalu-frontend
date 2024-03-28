import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import Page from '@/components/Page/Page'
import PageTitle from './components/PageTitle'
import { AddComaprisonSchema, addComparisonSchema } from '@/schema/comparisons'
import ComparisonForm from './components/Form'
import { COMPARISON } from '@/utils/query-keys'
import { editComparisons, fetchComparisonsById } from '@/queries/comparisons'
import { Comparison } from '@/types/comparison'
import { queryClient } from '@/utils/client'
import { toast } from '@/components/ui/use-toast'

const EditComparison = () => {
  const { id } = useParams() as { id: string }
  const navigate = useNavigate()
  const form = useForm<AddComaprisonSchema>({
    resolver: zodResolver(addComparisonSchema),
  })

  const { data: comparison, isLoading: isFetchingComparison } = useQuery([`${COMPARISON.COMPARISON}-${id}`], () =>
    fetchComparisonsById(Number(id)),
  )

  const { mutate } = useMutation((dto: Partial<Comparison>) => editComparisons(Number(id), dto), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${COMPARISON.COMPARISON}-${id}`])
      toast({ title: 'Comparison edited successfully!' })
      navigate('/comparisons')
    },
  })

  const handleSubmit = (values: AddComaprisonSchema) => {
    mutate(values)
  }

  useEffect(() => {
    if (!isFetchingComparison && comparison?.id) {
      form.setValue('access', comparison.access)
      form.setValue('name', comparison.name)
      form.setValue('scenarios', comparison.scenarios)
    }
  }, [comparison, isFetchingComparison])

  return (
    <Page className='space-y-8'>
      <PageTitle
        title={isFetchingComparison ? 'loading...' : comparison?.name || ''}
        backUrl='/comparisons'
        backUrlTitle='Back to Comparisons'
      />
      {isFetchingComparison ? (
        <></>
      ) : (
        <ComparisonForm form={form} onSubmit={handleSubmit} isEdit={true} isLoading={false} />
      )}
    </Page>
  )
}

export default EditComparison
