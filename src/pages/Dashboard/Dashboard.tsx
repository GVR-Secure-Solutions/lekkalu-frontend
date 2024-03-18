import React, { useEffect } from 'react'
// import { Briefcase, PieChartIcon, UsersIcon } from 'lucide-react'
// import colors from 'tailwindcss/colors'
import Page from '@/components/Page/Page'
// import StatCard from '@/components/StatCard'
// import BalanceBarChart from './components/BalanceBarChart'
// import RecentTransactions from './components/RecentTransactionts'
import BudgetChart from '@/components/Charts/BudgetChart'
import EmailVerification from '../EmailVerification/EmailVerification'
import { useAuthContext } from '@/hooks/use-auth'
import { deleteData, getData } from '@/utils/localstorage'
import { REMIND_ME_LATER, VERIFICATION_REMIND_DATE } from '@/utils/constants'
const Home = () => {
  const [isEmailVerifiedDialogOpen, setIsEmailVerifiedDialogOpen] = React.useState(false)
  const { userData } = useAuthContext()

  useEffect(() => {
    if (userData) {
      if (!userData?.email_verified) {
        const isRemind = getData(REMIND_ME_LATER)

        if (isRemind === null) {
          setIsEmailVerifiedDialogOpen(true)
        }

        if (isRemind === 'true') {
          const reminderDate = parseInt(getData(VERIFICATION_REMIND_DATE) || '0')
          const currentTimestamp = new Date().getTime()
          if (reminderDate < currentTimestamp) {
            setIsEmailVerifiedDialogOpen(true)
            deleteData(REMIND_ME_LATER)
            deleteData(VERIFICATION_REMIND_DATE)
          }
        }
      } else {
        deleteData(REMIND_ME_LATER)
        deleteData(VERIFICATION_REMIND_DATE)
      }
    }
  }, [userData])
  return (
    <Page className='space-y-4 min-h-screen'>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {/* <StatCard
          icon={<Briefcase />}
          title='Total Sales'
          value='$ 43530.00'
          color={colors.yellow['600']}
          extraValue='+24%'
        />
        <StatCard
          icon={<UsersIcon />}
          title='Total Income'
          value='$ 856530.00'
          color={colors.emerald['500']}
          extraValue='+24 %'
        />
        <StatCard
          icon={<Briefcase />}
          title='Total Sales'
          value='$ 43530.00'
          color={colors.purple['800']}
          extraValue='+24 %'
        />
        <StatCard
          icon={<PieChartIcon />}
          title='Total Expenses'
          value='$ 64530.00'
          color={colors.orange['700']}
          extraValue='-32%'
        />
      </div>
      <div className='grid grid-cols-5 h-full'>
        <div className='col-span-full md:col-span-3 h-full'>
          <BalanceBarChart />
        </div>
        <div className='col-span-full md:col-span-2'>
          <RecentTransactions />
        </div> */}
      </div>
      <div className='grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4'>
        <BudgetChart />
      </div>
      <EmailVerification
        isEmailVerifiedDialogOpen={isEmailVerifiedDialogOpen}
        setIsEmailVerifiedDialogOpen={setIsEmailVerifiedDialogOpen}
      />
    </Page>
  )
}
export default Home
