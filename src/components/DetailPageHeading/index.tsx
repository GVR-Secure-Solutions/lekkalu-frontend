import React from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type PageTitleType = {
  title: string
  backUrlTitle: string
}

const DetailPageHeading = ({ title, backUrlTitle }: PageTitleType) => {
  const navigate = useNavigate()
  return (
    <>
      <div>
        <h1 className='text-2xl font-bold'>{title}</h1>
      </div>
      <div
        className='flex items-center gap-2 text-muted-foreground w-52 hover:cursor-pointer'
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className='w-4 h-4' />
        {backUrlTitle}
      </div>
    </>
  )
}

export default DetailPageHeading
