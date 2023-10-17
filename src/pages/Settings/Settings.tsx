import React, { useMemo } from 'react'
import { getCountryList } from 'country-data-codes'
import { uniqBy } from 'lodash'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function Settings() {
  const { preferences, setPreferences, savePreferences } = useUserPreferences()

  const currencyCodes = useMemo(() => {
    const countryList = getCountryList()
    const currencyList = countryList
      .map((item) => ({
        name: item.currency.name,
        symbol: item.currency.symbol as string,
      }))
      .filter((item) => Boolean(item.symbol))

    return uniqBy(currencyList, (currency) => currency.symbol)
  }, [])

  const handleValueChange = (symbol: string) => {
    setPreferences((prev) => ({ ...prev, currencyUnit: symbol }))
  }

  return (
    <div className='max-w-screen-xl mx-auto align-self-start min-h-[80vh] p-4'>
      <div className='text-lg font-bold'>Manage your preferences</div>
      <div className='w-full h-[1px] bg-gray-500/20 my-4' />

      <div className='grid md:grid-cols-2 gap-4 mb-2'>
        <div className='space-y-2'>
          <div>First name</div>
          <Select onValueChange={handleValueChange} value={preferences.currencyUnit}>
            <SelectTrigger>
              <SelectValue placeholder='Currency Unit' />
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              {currencyCodes.map(({ name, symbol }) => (
                <SelectItem value={symbol} key={`${name}_${symbol}`}>
                  {name} {symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type='submit'
        onClick={() => {
          savePreferences()
        }}
      >
        Update
      </Button>
    </div>
  )
}
