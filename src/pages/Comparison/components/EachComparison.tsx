import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, UnlockIcon } from 'lucide-react'

import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'
import relativeTime from 'dayjs/plugin/relativeTime'
import { cn } from '@/utils/utils'
import Options from './EachComparisonOptions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Comparison as ComparisonSchemaType } from '@/types/comparison'
import { editComparisons } from '@/queries/comparisons'
import { queryClient } from '@/utils/client'
import { COMPARISON } from '@/utils/query-keys'

dayjs.extend(relativeTime)

type ComparisonType = {
  id: number
  access: string
  name: string
  style?: React.CSSProperties
  className?: string
  created_at?: string
  scenarios: number
}

const Comparison = ({ id, access, name, style, className, scenarios }: ComparisonType) => {
  const [allowRename, setAllowRename] = useState(false)
  const [comparisonName, setComparisonName] = useState(name)
  const { mutate } = useMutation((dto: Partial<ComparisonSchemaType>) => editComparisons(id, dto), {
    onSuccess: () => {
      setAllowRename(false)
      queryClient.invalidateQueries([COMPARISON.COMPARISON])
    },
  })
  const handleRename = () => {
    mutate({ name: comparisonName })
  }

  const comparisonNameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (allowRename) {
      comparisonNameRef.current?.focus()
    }
  }, [allowRename])

  const handleRenameCancel = () => {
    setAllowRename(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      handleRename()
    } else if (e.code === 'Escape') {
      handleRenameCancel()
    }
  }

  const handleAllowRename = () => {
    setAllowRename(true)
  }

  const handleAccessChange = () => {
    mutate({ access: access === 'Private' ? 'Public' : 'Private' })
  }

  return (
    <div
      className={cn('flex flex-col rounded-lg p-4 shadow-md hover:shadow-lg hover:cursor-pointer', className)}
      style={{ ...style }}
    >
      <Options id={id} access={access} handleAllowRename={handleAllowRename} handleAccessChange={handleAccessChange} />
      <div className='h-full'>
        <Link to={!allowRename ? `/comparisons/${id}` : ''}>
          <div className='flex flex-col gap-y-3 h-full'>
            <div
              className={`self-center p-5 text-primary p-5 rounded-full bg-${
                access === 'Private' ? 'red' : 'blue'
              }-200`}
            >
              {access === 'Private' ? <Lock size={80} /> : <UnlockIcon size={80} />}
            </div>
            {allowRename ? (
              <>
                <Input
                  ref={comparisonNameRef}
                  value={comparisonName}
                  onChange={(e) => setComparisonName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  type='textarea'
                />
                <div className='flex gap-2 justify-center'>
                  <Button onClick={handleRename} loading={false}>
                    Rename
                  </Button>
                  <Button onClick={handleRenameCancel} variant={'secondary'}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <p className='text-sm text-center'>{name}</p>
            )}
            <div className='mb-0 mt-auto'>
              <p className='text-sm text-center text-gray-500'>{scenarios} scenario</p>
              {/* <p className='text-xs text-center text-gray-500 mt-5'>{dayjs(created_at)?.fromNow()}</p> */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Comparison
