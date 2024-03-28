import React from 'react'
import { ArrowLeftIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type PageTitleType = {
  title: string
  backUrl: string
  backUrlTitle: string
}

const PageTitle = ({ title, backUrl, backUrlTitle }: PageTitleType) => {
  return (
    <>
      <div>
        <h1 className='text-2xl font-bold'>{title}</h1>
      </div>
      <Link className='flex items-center gap-2 text-muted-foreground w-52' to={backUrl}>
        <ArrowLeftIcon className='w-4 h-4' />
        {backUrlTitle}
      </Link>
    </>
  )
}

export default PageTitle
