import React from 'react'

import { Briefcase, PieChartIcon, UsersIcon } from 'lucide-react'
import colors from 'tailwindcss/colors'
import Page from '@/components/Page/Page'
import StatCard from '@/components/StatCard'

const Home = () => {
  return (
    <Page className='space-y-4'>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <StatCard
          icon={<Briefcase />}
          title='Total Sales'
          value={'$ 43530.00'}
          color={colors.yellow['500']}
          extraValue='+24%'
        />

        <StatCard
          icon={<UsersIcon />}
          title='Total Income'
          value={'$ 856530.00'}
          color={colors.emerald['500']}
          extraValue='+24 %'
        />

        <StatCard
          icon={<Briefcase />}
          title='Total Sales'
          value={'$ 43530.00'}
          color={colors.purple['700']}
          extraValue='+24 %'
        />

        <StatCard
          icon={<PieChartIcon />}
          title='Total Expenses'
          value={'$ 64530.00'}
          color={colors.orange['600']}
          extraValue='-32%'
        />
      </div>
    </Page>
  )
}

export default Home
