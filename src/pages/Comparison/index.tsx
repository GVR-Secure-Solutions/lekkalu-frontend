import React from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon } from 'lucide-react'
import { range } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import Page from '@/components/Page/Page'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Comparison from './components/EachComparison'
import { COMPARISON } from '@/utils/query-keys'
import { fetchComparisons } from '@/queries/comparisons'

export default function Scenarios() {
  const { data, isLoading } = useQuery([COMPARISON.COMPARISON], fetchComparisons)
  return (
    <Page className='space-y-4'>
      <div className='flex justify-end'>
        <Link to='/comparisons/new' className={buttonVariants({ variant: 'default' })}>
          <PlusIcon className='w-4 h-4 mr-2' />
          <span>Add Comparison</span>
        </Link>
      </div>
      <div>
        {isLoading ? (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'>
            {range(4).map((i) => (
              <Skeleton key={i} className='h-64 w-full' />
            ))}
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10'>
            {data?.map((each) => (
              <Comparison
                key={each?.name}
                id={each?.id}
                name={each?.name}
                access={each?.access}
                // created_at={each?.created_at}
                scenarios={each?.scenarios.length}
              />
            ))}
          </div>
        )}
        {!data?.length ? (
          <div>
            <p>You have no Comparison.</p>
            <Link to='/comparisons/new' className='block underline mt-2'>
              Click here to add.
            </Link>{' '}
          </div>
        ) : (
          <></>
        )}
      </div>
    </Page>
  )
}
