import React from 'react'
import Page from '@/components/Page/Page'
import AssetsTable from './components/AssetsTable'
import LiabilitiesTable from './components/LiabilitiesTable'
import AssetLiabilitiesChart from './components/AssetLiabilitiesCharts'

export default function BalanceSheet() {
  return (
    <Page className='space-y-4'>
      <div className='text-2xl font-bold'>Balance Sheet</div>
      <AssetLiabilitiesChart />

      <div className='text-2xl font-bold my-2'>Assets</div>
      <AssetsTable />

      <div className='text-2xl font-bold my-2'>Liabilities</div>
      <LiabilitiesTable />
    </Page>
  )
}
