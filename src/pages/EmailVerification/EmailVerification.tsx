import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/hooks/use-auth'
import { useToast } from '@/components/ui/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getData, setData } from '@/utils/localstorage'
import { REMIND_ME_LATER, VERIFICATION_REMIND_DATE } from '@/utils/constants'

type Props = {
  isEmailVerifiedDialogOpen: boolean
  setIsEmailVerifiedDialogOpen: (value: boolean) => void
}

export const EmailVerification = ({ isEmailVerifiedDialogOpen, setIsEmailVerifiedDialogOpen }: Props) => {
  const { userData, resendEmailMutation, verifyEmailMutation } = useAuthContext()
  const { toast } = useToast()

  useEffect(() => {
    if (userData && isEmailVerifiedDialogOpen) {
      const isRemindExist = getData(REMIND_ME_LATER)

      if (isRemindExist === null) {
        setData(REMIND_ME_LATER, '')
      }
    }
  }, [isEmailVerifiedDialogOpen, userData])

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

  const handleRemindMeLater = () => {
    setData(REMIND_ME_LATER, 'true')
    const tommorow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    setData(VERIFICATION_REMIND_DATE, tommorow.getTime().toString())
    setIsEmailVerifiedDialogOpen(false)
  }

  return (
    <Dialog open={isEmailVerifiedDialogOpen} onOpenChange={setIsEmailVerifiedDialogOpen}>
      <DialogContent className='m-4'>
        <DialogHeader>
          <DialogTitle>Verify Email</DialogTitle>
        </DialogHeader>

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
        <p className='text-center'>We sent a verification link to {userData?.email}. Please verify your email.</p>

        <Button
          variant='link'
          onClick={() => {
            handleResendEmail()
          }}
          loading={resendEmailMutation.isLoading}
        >
          Resend email
        </Button>
        {/* <div className='flex items-center space-x-2'>
          <Checkbox id='rememberMe' />
          <label
            htmlFor='rememberMe'
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          >
            Remind me later
          </label>
        </div> */}

        <div className='flex justify-center space-x-2'>
          <Button
            className='w-full'
            variant={'outline'}
            loading={verifyEmailMutation.isLoading}
            onClick={() => {
              handleRemindMeLater()
            }}
          >
            Remind me later
          </Button>

          <Button
            className='w-full'
            loading={verifyEmailMutation.isLoading}
            onClick={() => {
              handleEmailVerificationStatus()
            }}
          >
            Verify
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmailVerification
