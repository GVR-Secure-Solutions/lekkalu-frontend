import React, { Suspense, lazy } from 'react'
import './App.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import { LoaderIcon } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import AuthProtection from './components/AuthProtection/AuthProtection'

/** Authenticated Routes */
// @ts-expect-error (no-type-definitions)
const Home = lazy(() => import('@/pages/Home/Home'))
// @ts-expect-error (no-type-definitions)
const Goals = lazy(() => import('@/components/Goals/Goals'))
const IncomeStatement = lazy(() => import('@/pages/IncomeStatement/IncomeStatement'))
const Expenses = lazy(() => import('@/pages/Expenses/Expenses'))
const BalanceSheet = lazy(() => import('@/pages/BalanceSheet/BalanceSheet'))
const Settings = lazy(() => import('@/pages/Settings/Settings'))
const Profile = lazy(() => import('@/pages/Profile/Profile'))

/** Non-Authenticated Routes */
// @ts-expect-error (no-type-definitions)
const Hero = lazy(() => import('@/pages/Hero/Hero'))
const Signin = lazy(() => import('@/pages/Signin/Signin'))
const Signup = lazy(() => import('@/pages/Signup/Signup'))
const SipCalculator = lazy(() => import('@/pages/SIPCalculator/SIPCalculator'))
const CagrCalculator = lazy(() => import('@/pages/CAGRCalculator/CAGRCalculator'))
const EmiCalculator = lazy(() => import('@/pages/EmiCalculator/EmiCalculator'))
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions/TermsAndConditions'))
const PrivacyPolicies = lazy(() => import('@/pages/PrivacyPolicies/PrivacyPolicies'))
// @ts-expect-error (no-type-definitions)
const ErrorPage = lazy(() => import('@/components/ErrorPage/ErrorPage'))

function App() {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen w-full items-center justify-center gap-2'>
          <LoaderIcon className='w-4 h-4 animate-spin' />
          <div>Loading please wait...</div>
        </div>
      }
    >
      <Toaster />
      <Routes>
        <Route
          element={
            <AuthProtection>
              <Outlet />
            </AuthProtection>
          }
        >
          <Route path='/home' element={<Home />} />
          <Route path='/goals' element={<Goals />} />
          <Route path='/income-statement' element={<IncomeStatement />} />
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/balance-sheet' element={<BalanceSheet />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/' element={<Hero />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/sip-calculator' element={<SipCalculator />} />
        <Route path='/cagr-calculator' element={<CagrCalculator />} />
        <Route path='/emi-calculator' element={<EmiCalculator />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path='/privacy-policies' element={<PrivacyPolicies />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </Suspense>
  )
}

export default App
