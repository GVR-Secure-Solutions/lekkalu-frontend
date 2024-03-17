import React, { useState } from 'react'
import { LogOutIcon, MenuIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button, buttonVariants } from '@/components/ui/button'
import { CALCULATOR_ROUTES, FEATURES_ROUTES, ROUTES, UN_AUTHENTICATED_ROUTES } from '@/utils/app-shell'
import NavLink from './NavLink'
import When from '@/components/When/When'
import { useAuthContext } from '@/hooks/use-auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/utils/utils'

export default function MobileMenu({ isUnAuthenticatedHeader }: { isUnAuthenticatedHeader?: boolean }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { userData, logout, tokenData } = useAuthContext()

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' className='md:hidden'>
          <MenuIcon className='w-4 h-4' />
        </Button>
      </SheetTrigger>

      <SheetContent className='h-full '>
        <SheetHeader className='mb-4'>
          <SheetTitle className='text-2xl font-bold text-primary text-center'>finuncle</SheetTitle>
        </SheetHeader>

        <div className='flex flex-col justify-between h-full'>
          <div>
            <div className='space-y-1 '>
              {(isUnAuthenticatedHeader ? UN_AUTHENTICATED_ROUTES : ROUTES).map((route) => (
                <NavLink key={route.path} to={route.path} label={route.label} icon={route.icon} />
              ))}
            </div>

            <div className='mt-4'>Calculators</div>
            <div className='space-y-1'>
              {CALCULATOR_ROUTES.map((route) => (
                <NavLink key={route.path} to={route.path} label={route.label} icon={route.icon} />
              ))}
            </div>
            <div className='mt-4'>Features</div>
            <div className='space-y-1'>
              {FEATURES_ROUTES.map((route) => (
                <NavLink key={route.href} to={route.href} label={route.title} icon={route.icon as any} />
              ))}
            </div>
          </div>

          <div className='space-x-2 pb-12'>
            {/* {!isUnAuthenticatedHeader && <DownloadAllData />} */}

            {isUnAuthenticatedHeader ? (
              <When
                truthy={Boolean(tokenData)}
                fallback={
                  <div className='space-x-2 flex w-full'>
                    <Link
                      to='/signin'
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'border-1 border border-black/50',
                        'w-full',
                      )}
                    >
                      Signin
                    </Link>

                    <Link
                      to='/signup'
                      className={cn(buttonVariants({ variant: 'secondary' }), 'w-full border-1 border border-black/50')}
                    >
                      Signup
                    </Link>
                  </div>
                }
              >
                <Link to='/dashboard' className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}>
                  Dashboard
                </Link>
              </When>
            ) : (
              <When truthy={Boolean(userData)}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline'>@{userData?.username}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <When truthy={Boolean(userData?.email)}>
                      <DropdownMenuLabel>{userData?.email}</DropdownMenuLabel>
                    </When>

                    <DropdownMenuItem className='cursor-pointer' asChild>
                      <Link to='/profile'>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className='cursor-pointer' onClick={logout}>
                      <LogOutIcon className='mr-2 h-4 w-4' />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </When>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
