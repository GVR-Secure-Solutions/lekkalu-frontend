import React from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/hooks/use-auth'
import Page from '@/components/Page/Page'
import { useToast } from '@/components/ui/use-toast'

export const EmailVerification = () => {
  const { tokenData, userData, resendEmailMutation, verifyEmailMutation, logout } = useAuthContext()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const { toast } = useToast()

  if (tokenData && userData?.email_verified) {
    return <Navigate to={{ pathname: redirectTo }} replace />
  }

  if (!tokenData) {
    return <Navigate to={{ pathname: '/signin' }} replace />
  }

  const handleResendEmail = () => {
    if (userData) {
      resendEmailMutation.mutate({ email: userData.email })
    } else {
      toast({
        title: 'User not found!',
        description: 'Please sign in again!',
      })
    }
  }
  const handleEmailVerificationStatus = () => {
    verifyEmailMutation.mutate()
  }

  const handleSignInClick = () => {
    logout()
  }

  return (
    <div className='bg-primary flex items-center justify-center h-screen'>
      <Page className='flex items-center justify-center'>
        <div className='flex-1 max-w-xl mx-auto'>
          <div className='bg-white p-4 m-4 rounded-lg'>
            <div className='flex flex-col gap-4'>
              <h1 className='text-2xl font-bold'>Email verification</h1>

              <div className='flex justify-center'>
                <svg
                  fill='silver'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 512 512'
                  enableBackground='new 0 0 512 512'
                  width={'220'}
                  height={'150'}
                >
                  <g>
                    <g>
                      <path d='m494.2,488c0,0 0-225.8 0-301 0-3.1-3.9-7-7.7-9.9l-78.7-57.1v-63.1c0-6.2-5.2-10.4-10.4-10.4h-89.7l-45.7-33.3c-3.1-2.1-8.3-2.1-11.5,0l-45.7,33.3h-89.7c-6.2,0-10.4,5.2-10.4,10.4v62.4l-79.7,57.9c-4.7,2.9-7.7,6.7-7.7,9.9 0,75.7 0,303 0,303 0,5.9 4.7,10 9.6,10.4 0.3,0 0.5,0 0.8,0h456c6.7-0.1 10.5-5.3 10.5-12.5zm-19.8-282.3v263.6l-172.1-137.8 172.1-125.8zm-7.7-18.3l-58.9,42.9v-86.2l58.9,43.3zm-210.9-154.5l18.3,13.5h-36.7l18.4-13.5zm131.2,34.4v178.2l-131.2,95.6-131.2-95.6v-178.2h262.4zm-349.8,138.4l172.1,125.8-172.1,138.6v-264.4zm67.6,25.4l-60.4-44 60.4-43.9v87.9zm-48.9,249.5l170.1-136.9 23.5,17.2c4.5,3.4 7.9,3.4 12.5,0l23.5-17.2 171.1,136.9h-400.7z' />
                      <rect width='140.5' x='186.1' y='118.3' height='19.8' />
                      <rect width='140.5' x='186.1' y='181.8' height='19.8' />
                      <rect width='140.5' x='186.1' y='245.3' height='19.8' />
                    </g>
                  </g>
                </svg>
              </div>
              <p className='text-center'>
                We sent a verification link to {userData?.email}. Please verify it to complete your registration.
              </p>

              <Button
                className='w-full'
                loading={verifyEmailMutation.isLoading}
                onClick={() => {
                  handleEmailVerificationStatus()
                }}
              >
                Continue
              </Button>

              <Button
                variant='link'
                onClick={() => {
                  handleResendEmail()
                }}
                loading={resendEmailMutation.isLoading}
              >
                Resend email
              </Button>

              <Link
                to='/signin'
                replace
                className='block text-sm text-muted-foreground my-2 flex justify-center text-center'
                onClick={() => {
                  handleSignInClick()
                }}
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </Page>
    </div>
  )
}

export default EmailVerification
