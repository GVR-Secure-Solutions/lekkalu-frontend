import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import useRefreshToken from '@/hooks/useRefresh'
import { Context } from '@/provider/Provider'

const PersistLogin = () => {
  const { authToken, fetchUser } = useContext(Context)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useRefreshToken()

  useEffect(() => {
    const verifyIfHasToken = async () => {
      try {
        await refresh()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUserAndSetLoading = async () => {
      setIsLoading(false)
      await fetchUser(authToken)
    }

    !authToken ? verifyIfHasToken() : fetchUserAndSetLoading()
  }, [])

  return <>{isLoading ? <p className='text-center mt-5'>Loading...</p> : <Outlet />}</>
}

export default PersistLogin
