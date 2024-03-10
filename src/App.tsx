import React, { Suspense, lazy, useEffect } from 'react'
import AOS from 'aos'
import { Routes, Route, Outlet } from 'react-router-dom'
import { LoaderIcon } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'
import AuthProtection from './components/AuthProtection/AuthProtection'
import AppShell from './components/AppShell/AppShell'
import UnAuthenticatedHeader from './components/UnAuthenticatedHeader/UnAuthenticatedHeader'
import Footer from './components/Footer/Footer'
import CookieConsent from './components/CookieConsent/CookieConsent'

/** Authenticated Routes */
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'))
const Goals = lazy(() => import('@/pages/Goals/Goals'))
const CreateGoal = lazy(() => import('@/pages/Goals/AddEditGoalPages/CreateGoal/CreateGoal'))
const EditGoal = lazy(() => import('@/pages/Goals/AddEditGoalPages/EditGoal'))
const GoalDetails = lazy(() => import('@/pages/GoalDetails/GoalDetails'))
const IncomeStatement = lazy(() => import('@/pages/IncomeStatement/IncomeStatement'))
const Expenses = lazy(() => import('@/pages/Expenses/Expenses'))
const Lending = lazy(() => import('@/pages/Lending/Lending'))
const BalanceSheet = lazy(() => import('@/pages/BalanceSheet/BalanceSheet'))
const Settings = lazy(() => import('@/pages/Settings/Settings'))
const Profile = lazy(() => import('@/pages/Profile/Profile'))

/** Non-Authenticated Routes */
const Home = lazy(() => import('@/pages/Home/Home'))
const Signin = lazy(() => import('@/pages/Signin/Signin'))
const Signup = lazy(() => import('@/pages/Signup/Signup'))
const SipCalculator = lazy(() => import('@/pages/SIPCalculator/SIPCalculator'))
const CagrCalculator = lazy(() => import('@/pages/CAGRCalculator/CAGRCalculator'))
const EmiCalculator = lazy(() => import('@/pages/EmiCalculator/EmiCalculator'))
const TermsAndConditions = lazy(() => import('@/pages/TermsAndConditions/TermsAndConditions'))
const PrivacyPolicies = lazy(() => import('@/pages/PrivacyPolicies/PrivacyPolicies'))
const Pricing = lazy(() => import('@/pages/Pricing/Pricing'))
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'))
const Support = lazy(() => import('./pages/Support/Support'))
const FeaturesDetails = lazy(() => import('./pages/Features/FeaturesDetails'))
const EmailVerification = lazy(() => import('@/pages/EmailVerification/EmailVerification'))

function App() {
  useEffect(() => {
    AOS.init()
  }, [])
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
              <AppShell>
                <Outlet />
              </AppShell>
            </AuthProtection>
          }
        >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/goals' element={<Goals />} />
          <Route path='/goals/new' element={<CreateGoal />} />
          <Route path='/goals/edit/:id' element={<EditGoal />} />
          <Route path='/goals/:id' element={<GoalDetails />} />
          <Route path='/income-statement' element={<IncomeStatement />} />
          <Route path='/expenses' element={<Expenses />} />
          <Route path='/lending' element={<Lending />} />
          <Route path='/balance-sheet' element={<BalanceSheet />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/profile' element={<Profile />} />
        </Route>

        <Route
          element={
            <>
              <CookieConsent />
              <UnAuthenticatedHeader />
              <div className='min-h-screen mt-16 lg:mt-16'>
                <Outlet />
              </div>
              <Footer />
            </>
          }
        >
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/sip-calculator' element={<SipCalculator />} />
          <Route path='/cagr-calculator' element={<CagrCalculator />} />
          <Route path='/emi-calculator' element={<EmiCalculator />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
          <Route path='/privacy-policies' element={<PrivacyPolicies />} />
          <Route path='/pricing' element={<Pricing />} />
          <Route path='/support' element={<Support />} />
          <Route path='/feature/:toolName' element={<FeaturesDetails />} />
          <Route path='/email-verification' element={<EmailVerification />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default App
