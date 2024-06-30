import { calculateSip, calculateCagr, calculateEmi, calculateAssetsForEmi, calculateTenureByUnit } from './calculators'
import { createUrlString } from './clipboard'
import { CALCULATORS_FEATURES } from './details-page-data'
import { CALCULATOR_ROUTES } from './app-shell'

describe('Calculate-SIP', () => {
  test('calculates SIP correctly', () => {
    const result = calculateSip(5000, 5, 10)
    expect(result).toBeDefined()
    expect(result.totalInvested).toBe(300000)
  })
})

describe('Calculate-CAGR', () => {
  test('calculates CAGR correctly', () => {
    const result = calculateCagr(5000, 25000, 5)
    expect(result).toBeDefined()
    expect(result.absoluteCAGR).toBe('0.38')
  })
})

describe('Calculate-EMI', () => {
  test('calculates EMI correctly', () => {
    const result = calculateEmi(300000, 11, 3, 'Months')
    expect(result).toBeDefined()
    expect(result!.loan_emi).toBe('101838.91')
  })
})

describe('CalculateAssetsForEMI', () => {
  test('calculates assets correctly', () => {
    const result = calculateAssetsForEmi(100000, '5000')
    expect(result).toBeDefined()
    expect(result.totalVal).toBe(105000)
  })
})

describe('CalculateTenureByUnit', () => {
  test('calculates tenure correctly', () => {
    const result = calculateTenureByUnit('Years', 60)
    expect(result).toBe(5)
  })
})

describe('CreateUrlString', () => {
  test('it creates a valid URL string', () => {
    const params = {
      key1: 'value1',
      key2: 123,
      key3: 'value3',
    }
    const expectedUrl = 'key1=value1&key2=123&key3=value3'
    expect(createUrlString(params)).toEqual(expectedUrl)
  })
})

describe('CALCULATOR_ROUTES', () => {
  test('match calculators routes path', () => {
    const sipCalculatorRoute = CALCULATORS_FEATURES.find((route) => route.href === '/sip-calculator')
    expect(sipCalculatorRoute).toBeTruthy()
    expect(sipCalculatorRoute!.sub_title).toBe('SIP Calculator')

    const emiCalculatorRoute = CALCULATORS_FEATURES.find((route) => route.href === '/emi-calculator')
    expect(emiCalculatorRoute).toBeTruthy()
    expect(emiCalculatorRoute!.sub_title).toBe('EMI Calculator')

    const cagrCalculatorRoute = CALCULATORS_FEATURES.find((route) => route.href === '/cagr-calculator')
    expect(cagrCalculatorRoute).toBeTruthy()
    expect(cagrCalculatorRoute!.sub_title).toBe('CAGR Calculator')

    const xirrCalculatorRoute = CALCULATORS_FEATURES.find((route) => route.href === '/xirr-calculator')
    expect(xirrCalculatorRoute).toBeTruthy()
    expect(xirrCalculatorRoute!.sub_title).toBe('XIRR Calculator')
  })
})

describe('CALCULATOR_ROUTES', () => {
  test('match calculators routes path', () => {
    const sipCalculatorRoute = CALCULATOR_ROUTES.find((route) => route.path === '/sip-calculator')
    expect(sipCalculatorRoute).toBeTruthy()
    expect(sipCalculatorRoute!.label).toBe('SIP Calculator')

    const emiCalculatorRoute = CALCULATOR_ROUTES.find((route) => route.path === '/emi-calculator')
    expect(emiCalculatorRoute).toBeTruthy()
    expect(emiCalculatorRoute!.label).toBe('EMI Calculator')

    const cagrCalculatorRoute = CALCULATOR_ROUTES.find((route) => route.path === '/cagr-calculator')
    expect(cagrCalculatorRoute).toBeTruthy()
    expect(cagrCalculatorRoute!.label).toBe('CAGR Calculator')

    const xirrCalculatorRoute = CALCULATOR_ROUTES.find((route) => route.path === '/xirr-calculator')
    expect(xirrCalculatorRoute).toBeTruthy()
    expect(xirrCalculatorRoute!.label).toBe('XIRR Calculator')
  })
})
