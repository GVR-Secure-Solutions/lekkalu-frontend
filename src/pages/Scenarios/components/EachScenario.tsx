import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Link } from 'react-router-dom'
import { Scenario } from '@/types/scenarios'
import EachScenarioOptions from './EachScenarioOptions'

dayjs.extend(relativeTime)

const EachScenario = ({ id, name }: Scenario) => {
  return (
    <div key={id} className='relative border rounded flex flex-col space-y-5 shadow hover:shadow-md'>
      <div className='absolute top-5 right-5'>
        <EachScenarioOptions id={id} />
      </div>
      <Link to={`/scenarios/${id}`} className='text-center flex flex-col h-full p-5 pt-16'>
        <h2 className='mb-5'>{name}</h2>
      </Link>
    </div>
  )
}

export default EachScenario
