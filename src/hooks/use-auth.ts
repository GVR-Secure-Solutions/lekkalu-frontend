import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import constate from 'constate'
import { useNavigate } from 'react-router-dom'
import { fetchUser, googleSignup, login, refreshToken, signup } from '@/queries/auth'
import { deleteCookie, getCookie, setCookie } from '@/utils/cookie'
import { ACCESS_TOKEN_KEY, COOKIE_CONSENT, REFRESH_TOKEN_KEY } from '@/utils/constants'
import { AUTH } from '@/utils/query-keys'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'
import { clearData } from '@/utils/localstorage'

export function useAuth() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { data: userData, refetch: fetchUserData } = useQuery({ queryKey: [AUTH.USER], queryFn: fetchUser })

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    const storedIsOpen = localStorage.getItem('isOpen')
    return storedIsOpen !== null ? JSON.parse(storedIsOpen) : true
  })

  useEffect(() => {
    localStorage.setItem('isOpen', JSON.stringify(isOpen))
  }, [isOpen])

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const {
    isLoading: isAuthenticationInProgress,
    data: tokenData,
    isSuccess: isAuthenticationSuccess,
  } = useQuery({
    queryKey: [AUTH.LOGGED_IN],
    queryFn: refreshToken,
  })

  useEffect(() => {
    if (isAuthenticationSuccess && tokenData) {
      setCookie(REFRESH_TOKEN_KEY, tokenData.refresh, 30)
      setCookie(ACCESS_TOKEN_KEY, tokenData.access, 30)
    }
  }, [isAuthenticationSuccess, tokenData])

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast({ title: 'Successfully logged in!' })
      /** Saving the tokens in cookies */
      setCookie(REFRESH_TOKEN_KEY, data.refresh, 30)
      setCookie(ACCESS_TOKEN_KEY, data.access, 30)
      setCookie(COOKIE_CONSENT, 'accept', 30)
      /** updating the data in queryClient */
      qc.setQueryData([AUTH.LOGGED_IN], data)

      fetchUserData()
    },
    onError: (err) => toast(getErrorMessage(err)),
  })

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({
        title: 'Signup Success!',
        description: 'Your account has been created successfully now you can login to you account!',
      })
      navigate('/signin')
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const googleSignupMutation = useMutation({
    mutationFn: googleSignup,
    onSuccess: (data) => {
      toast({ title: 'Successfully logged in!' })
      /** Saving the tokens in cookies */
      setCookie(REFRESH_TOKEN_KEY, data.refresh, 30)
      setCookie(ACCESS_TOKEN_KEY, data.access, 30)
      setCookie(COOKIE_CONSENT, 'accept', 30)
      /** updating the data in queryClient */
      qc.setQueryData([AUTH.LOGGED_IN], data)

      fetchUserData()
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const logout = useCallback(() => {
    deleteCookie(REFRESH_TOKEN_KEY)
    deleteCookie(ACCESS_TOKEN_KEY)
    qc.removeQueries({ queryKey: [AUTH.LOGGED_IN] })
    clearData()
    navigate('/')
    //  eslint-disable-next-line
  }, [navigate])

  useEffect(() => {
    if (getCookie(ACCESS_TOKEN_KEY)) {
      fetchUserData()
    }
  }, [fetchUserData])

  return useMemo(
    () => ({
      isAuthenticationInProgress,
      tokenData,
      loginMutation,
      logout,
      signupMutation,
      userData,
      fetchUserData,
      googleSignupMutation,
      isOpen,
      toggle,
    }),
    [
      isAuthenticationInProgress,
      tokenData,
      loginMutation,
      logout,
      signupMutation,
      userData,
      fetchUserData,
      googleSignupMutation,
      isOpen,
      toggle,
    ],
  )
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
