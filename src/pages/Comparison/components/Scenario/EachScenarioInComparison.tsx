import React, { useMemo } from 'react'
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
  const IS_AUTHENTICATED_USER = useMemo(() => Boolean(userData), [userData])
  return (
    <div className='border p-5 rounded flex flex-col space-y-5 shadow hover:shadow-md'>
      <div className='ml-auto'>
        {IS_AUTHENTICATED_USER ? <ScenarioOption id={id} handleRemoveScenario={handleRemoveScenario} /> : <></>}
      </div>
      <div className='text-center'>
        <p>{name}</p>
      </div>
    </div>
  )
}

export default Scenario
