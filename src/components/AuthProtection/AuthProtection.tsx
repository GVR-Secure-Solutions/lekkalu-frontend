import React from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { LoaderIcon } from 'lucide-react'
import { useAuthContext } from '@/hooks/use-auth'

type Props = {
  children: React.ReactNode
}

export default function AuthProtection({ children }: Props) {
  const location = useLocation()
  const { isAuthenticationInProgress, tokenData } = useAuthContext()

  if (isAuthenticationInProgress) {
    return (
      <div className='w-full h-screen z-40 flex items-center justify-center gap-2'>
        <LoaderIcon className='w-4 h-4 animate-spin' />
        <div>Authentication in progress...</div>
      </div>
    )
  }

  if (tokenData) {
    return children
  }

  return <Navigate to={{ pathname: '/signin', search: `redirectTo=${location.pathname}` }} />
}
