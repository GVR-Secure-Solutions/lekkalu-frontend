/* eslint-disable react/self-closing-comp */
import React from 'react'
import { Link } from 'react-router-dom'
import ScenarioOption from './EachScenarioOptions'
import { useAuth } from '@/hooks/use-auth'

type ScenarioType = {
  name: string
  username: string
  id: number
  comparisonId: number
  handleRemoveScenario: (id: number) => void
}

const Scenario = ({ name, id, handleRemoveScenario }: ScenarioType) => {
  const { userData } = useAuth()
  const IS_AUTHENTICATED_USER = Boolean(userData?.email)
  return (
    <div className='relative border shadow hover:shadow-md min-h-[130px] min-w-[230px]'>
      {IS_AUTHENTICATED_USER ? (
        <div className='absolute right-2 ml-auto top-2'>
          <ScenarioOption id={id} handleRemoveScenario={handleRemoveScenario} />
        </div>
      ) : (
        <></>
      )}
      <Link
        to={IS_AUTHENTICATED_USER ? `/scenarios/${id}` : ''}
        className='flex h-full justify-center items-center pt-5'
      >
        <div className='text-center'>
          <p>{name}</p>
        </div>
      </Link>
    </div>
  )
}

export default Scenario
