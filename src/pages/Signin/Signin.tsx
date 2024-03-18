import React, { useEffect } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AppleIcon, FacebookIcon } from 'lucide-react'
import When from '@/components/When/When'
import { LoginSchema, loginSchema } from '@/schema/auth'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Password from '@/components/ui/password'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/hooks/use-auth'
import Page from '@/components/Page/Page'
import GoogleAuth from '@/components/SocialAuth/GoogleAuth'

export const Signin = () => {
  const { tokenData, loginMutation, googleSignupMutation } = useAuthContext()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const authCode = searchParams.get('code')
  const isUnderDevelopment = true

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  })

  const handleSignin = (values: LoginSchema) => {
    loginMutation.mutate(values)
  }

  useEffect(() => {
    if (authCode) {
      googleSignupMutation.mutate({ code: authCode })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCode])

  if (tokenData) {
    return <Navigate to={{ pathname: redirectTo }} replace />
  }

  return (
    <div className='bg-primary'>
      <Page className='flex items-center justify-around h-screen'>
        <div className='flex-1 pt-4 hidden md:flex items-center justify-center'>
          <div className='relative'>
            <div className='absolute -top-10 -left-10 bg-white rounded-full w-10 h-10' />
            <p className='text-white text-2xl font-medium text-center'>finuncle</p>
          </div>
        </div>

        <div className='flex-1 max-w-xl mx-auto'>
          <div className='bg-white p-4 m-4 rounded-lg'>
            <h1 className='text-2xl font-bold'>Log in</h1>
            <p className='text-muted-foreground text-sm mb-4'>Welcome back to finuncle!</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSignin)} className='flex flex-col gap-4'>
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input disabled={loginMutation.isLoading} placeholder='Enter your username' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Password disabled={loginMutation.isLoading} placeholder='Enter your password' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='rememberMe'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='flex items-center space-x-2'>
                          <Checkbox
                            disabled={loginMutation.isLoading}
                            id='rememberMe'
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <label
                            htmlFor='rememberMe'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Remember Me
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' loading={loginMutation.isLoading}>
                  Continue
                </Button>
              </form>
            </Form>

            <Link to='/signup' className='block text-sm text-muted-foreground my-2'>
              Don&apos;t have an account? Sign Up
            </Link>
            <div className='space-y-4'>
              <div className='flex items-center gap-2'>
                <div className='h-[1px] bg-muted w-full' />
                <p>OR</p>
                <div className='h-[1px] bg-muted w-full' />
              </div>
              <div className='flex justify-center items-center mx-0'>
                <GoogleAuth buttonText='Login with Google' />
              </div>
            </div>
            <When truthy={!isUnderDevelopment}>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <div className='h-[1px] bg-muted w-full' />
                  <p>OR</p>
                  <div className='h-[1px] bg-muted w-full' />
                </div>

                <Button className='w-full' variant='outline'>
                  <FacebookIcon className='mr-2 w-4 h-4' />
                  <span>Continue with Facebook</span>
                </Button>
                <Button className='w-full' variant='outline'>
                  <span>Continue with Google</span>
                </Button>

                {/* @TODO: Update Apple icon */}
                <Button className='w-full' variant='outline'>
                  <AppleIcon className='mr-2 w-4 h-4' />
                  <span>Continue with Apple</span>
                </Button>
              </div>
            </When>
          </div>
        </div>
      </Page>
    </div>
  )
}

export default Signin
