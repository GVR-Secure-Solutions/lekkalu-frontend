import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import constate from 'constate'
import { useNavigate } from 'react-router-dom'
import { fetchUser, googleSignup, login, refreshToken, resendEmail, signup } from '@/queries/auth'
import { deleteCookie, setCookie } from '@/utils/cookie'
import { ACCESS_TOKEN_KEY, COOKIE_CONSENT, REFRESH_TOKEN_KEY } from '@/utils/constants'
import { AUTH } from '@/utils/query-keys'
import { useToast } from '@/components/ui/use-toast'
import { getErrorMessage } from '@/utils/utils'
import { clearData } from '@/utils/localstorage'

export function useAuth() {
  const qc = useQueryClient()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { mutate: fetchUserData, data: userData } = useMutation(fetchUser, {})

  const {
    isLoading: isAuthenticationInProgress,
    data: tokenData,
    remove: removeTokenData,
  } = useQuery([AUTH.LOGGED_IN], refreshToken, {
    onSuccess: (data) => {
      setCookie(REFRESH_TOKEN_KEY, data.refresh, 30)
      setCookie(ACCESS_TOKEN_KEY, data.access, 30)
      fetchUserData()
    },
  })

  const loginMutation = useMutation(login, {
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

  const signupMutation = useMutation(signup, {
    onSuccess: () => {
      toast({
        title: 'Signup Success!',
        description: 'Your account has been created successfully now you can login to you account!',
      })
      navigate('/signin')
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const googleSignupMutation = useMutation(googleSignup, {
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

  const resendEmailMutation = useMutation(resendEmail, {
    onSuccess: () => {
      toast({
        title: 'Email send successfully!',
      })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const verifyEmailMutation = useMutation(fetchUser, {
    onSuccess: (data) => {
      if (!data?.email_verified) {
        toast({
          title: 'Email is not verified yet!',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Email is verified successfully!',
        })
        fetchUserData()
      }
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })

  const logout = useCallback(() => {
    deleteCookie(REFRESH_TOKEN_KEY)
    deleteCookie(ACCESS_TOKEN_KEY)
    removeTokenData()
    clearData()

    navigate('/')
  }, [removeTokenData, navigate])

  return {
    isAuthenticationInProgress,
    tokenData,
    loginMutation,
    logout,
    signupMutation,
    userData,
    fetchUserData,
    googleSignupMutation,
    resendEmailMutation,
    verifyEmailMutation
  }
}

export const [AuthProvider, useAuthContext] = constate(useAuth)
