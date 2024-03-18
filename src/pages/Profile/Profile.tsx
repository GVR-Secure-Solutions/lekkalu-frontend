import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import colors from 'tailwindcss/colors'
import { changePasswordSchema, userProfileSchema } from '../../schema/user'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Password from '@/components/ui/password'
import { useToast } from '@/components/ui/use-toast'
import { useAuthContext } from '@/hooks/use-auth'
import { updateUserDetails } from '@/queries/user'
import { getErrorMessage } from '@/utils/utils'
import EmailVerification from '../EmailVerification/EmailVerification'

type UserProfileSchema = z.infer<typeof userProfileSchema>
type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

/**
 * @todo Remove the check once password functionality is implemented
 */
const HIDE_PASSWORD_RESET_FUNCTIONALITY = true

export default function Profile() {
  const { toast } = useToast()
  const { userData, fetchUserData } = useAuthContext()
  const [isEmailVerifiedDialogOpen, setIsEmailVerifiedDialogOpen] = React.useState(false)
  // @TODO: Add user details initially
  const userProfileForm = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userData && userData,
  })

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  })

  React.useEffect(() => {
    if (userData) {
      userProfileForm.reset(userData)
    }
  }, [userData, userProfileForm])

  const updateUserDetailMutation = useMutation(updateUserDetails, {
    onSuccess: () => {
      fetchUserData()
      toast({
        title: 'Details Updated Successfully!',
        description: '',
      })
    },
    onError: (err: any) => toast(getErrorMessage(err)),
  })
  const handleUserProfileUpdate = (values: UserProfileSchema) => {
    updateUserDetailMutation.mutate(values)
  }

  const handlePasswordChange = () => {
    toast({
      title: 'Feature under development!',
      description: 'This feature is still under development and will be available soon!',
    })
  }

  return (
    <div className='max-w-screen-xl mx-auto align-self-start min-h-[80vh] p-4'>
      <div className='flex justify-between items-center'>
        <div className='text-lg font-bold'>Update your info</div>
        {userData?.email_verified ? null : <Button
          variant={'outline'}
          onClick={() => {
            setIsEmailVerifiedDialogOpen(!isEmailVerifiedDialogOpen)
          }}
        >
          Verify Email
        </Button>}
      </div>
      <div className='w-full h-[1px] bg-gray-500/20 my-4' />

      <Form {...userProfileForm}>
        <form onSubmit={userProfileForm.handleSubmit(handleUserProfileUpdate)} className='space-y-4 mb-4'>
          <div className='grid md:grid-cols-2 gap-4'>
            <FormField
              control={userProfileForm.control}
              name='first_name'
              defaultValue=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your first name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userProfileForm.control}
              name='last_name'
              defaultValue=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your last name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userProfileForm.control}
              name='email'
              defaultValue=''
              render={({ field }) => (
                <FormItem className='flex flex-col justify-center '>
                  <div className='flex justify-between align-middle'>
                    <FormLabel>Email</FormLabel>
                    {userData?.email_verified ? (
                      <FormLabel style={{ color: colors.green['500'] }}>
                        {userData?.email_verified ? 'Verified' : 'Not Verified'}
                      </FormLabel>
                    ) : (
                      <FormLabel style={{ color: colors.red['500'] }}>
                        {userData?.email_verified ? 'Verified' : 'Not Verified'}
                      </FormLabel>
                    )}
                  </div>
                  <FormControl>
                    <Input placeholder='Enter your email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={userProfileForm.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your Username' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type='submit'>Update</Button>
        </form>
      </Form>

      {!HIDE_PASSWORD_RESET_FUNCTIONALITY && (
        <>
          <div className='text-lg font-bold'>Update your password</div>
          <div className='w-full h-[1px] bg-gray-500/20 my-4' />

          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className='space-y-4 mb-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                <FormField
                  control={passwordForm.control}
                  name='current_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Password placeholder='Enter your current password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name='new_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Password placeholder='Enter your new password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name='confirm_password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Password placeholder='Confirm password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type='submit'>Change Password</Button>
            </form>
          </Form>
        </>
      )}
      <EmailVerification
        isEmailVerifiedDialogOpen={isEmailVerifiedDialogOpen}
        setIsEmailVerifiedDialogOpen={setIsEmailVerifiedDialogOpen}
      />
    </div>
  )
}
