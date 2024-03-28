import React, { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import Page from '@/components/Page/Page'
import DetailPageHeading from '@/components/DetailPageHeading'
import { AUTH, SCENARIOS } from '@/utils/query-keys'
import { fetchScenarioById } from '@/queries/scenarios'
import { Skeleton } from '@/components/ui/skeleton'
import { useImaginaryAuth } from './context/use-imaginaryAuth'
import CreateButton from './components/CreateButton'
import { queryClient } from '@/utils/client'

const LoadingSkeleton = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <Skeleton className='w-52 h-10' />
        <Skeleton className='w-40 h-10' />
      </div>
      <div className='mt-10'>
        <Skeleton className='w-full h-10' />
      </div>
    </div>
  )
}

export default function ScenarioDefault() {
  const { id } = useParams() as { id: string }
  const scenarioId = Number(id)
  const { loginImaginaryUser } = useImaginaryAuth()
  const { data, isLoading } = useQuery([`${SCENARIOS.SCENARIOS}-${scenarioId}`], () => fetchScenarioById(scenarioId), {
    onSuccess(data) {
      loginImaginaryUser.mutate({ username: data.imag_username, password: data.imag_password, id: data.id })
    },
  })
  const { data: currentImaginaryUser } = useQuery<string>([AUTH.CURRENT_IMAGINARY_USER])

  useEffect(() => {
    return () => {
      queryClient.setQueryData([AUTH.CURRENT_IMAGINARY_USER], '')
    }
  }, [])

  const { data: imaginaryUsers } = useQuery<any>([AUTH.IMAGINARY_CLIENT])
  const isLoggedIn = Boolean(currentImaginaryUser && imaginaryUsers[currentImaginaryUser].access)

  return (
    <Page className='space-y-8'>
      <DetailPageHeading
        backUrl='/scenarios'
        backUrlTitle='Back to scenarios'
        title={isLoading ? 'Loading...' : data?.name || ''}
      />

      {isLoading || !isLoggedIn ? (
        <LoadingSkeleton />
      ) : (
        <div>
          <div className='flex justify-between'>
            <CreateButton username={data?.imag_username || ''} />
          </div>
        </div>
      )}
    </Page>
  )
}
