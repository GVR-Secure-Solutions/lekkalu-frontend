import React, { useMemo } from 'react'
import { PlusIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import AddOrEditIncomeExpenseForScenario from './IncomeExpenses'
import { AddIncomeStatementSchema, AddIncomeStateSchemaForScenario } from '@/schema/income-statement'
import { useImaginaryAuth } from '../context/use-imaginaryAuth'
import { AUTH, BALANCE_SHEET, INCOME_STATEMENT, SCENARIOS } from '@/utils/query-keys'
import { IncomeStatement } from '@/types/income-statement'
import EachIncomeExpenseForScenario from './IncomeExpenses/EachExpense'
import AddOrEditLiabilityDialog from './Liability/AddorEditLiabilityDialog'
import { AddLiabilitySchema, AddPhysicalAssetSchemaForScenario } from '@/schema/balance-sheet'
import { Liability, PhysicalAsset } from '@/types/balance-sheet'
import EachLiabilityForScenario from './Liability/EachLiabilityForScenario'
import AddOrEditAssetsForScenario from './Assets/AddOrEditAssetsForScenarios'
import EachAsset from './Assets/EachAsset'
import { useAuth } from '@/hooks/use-auth'
import { fetchScenarios } from '@/queries/scenarios'
import { LoadingSkeleton } from '../ScenarioDetail'

const CreateButton = ({ username }: { username: string }) => {
  const { data: imaginaryUser } = useQuery<any>({ queryKey: [AUTH.IMAGINARY_CLIENT] })
  const { getAPIClientForImaginaryUser } = useImaginaryAuth()
  const { userData } = useAuth()
  const IS_AUTHENTICATED_USER = Boolean(userData?.username)
  const apiClient = getAPIClientForImaginaryUser(imaginaryUser[username]?.access)

  const { id: currentScenarioID } = useParams()

  const { data: allScenarios } = useQuery({
    queryKey: [SCENARIOS.SCENARIOS],
    queryFn: fetchScenarios,
    enabled: IS_AUTHENTICATED_USER,
  })

  const IS_MY_SCENARIO = useMemo(() => {
    return allScenarios?.some((each) => each.id === Number(currentScenarioID))
  }, [allScenarios, currentScenarioID])

  async function createIncomeExpense(dto: AddIncomeStatementSchema) {
    const { data } = await apiClient.post('income_expense/', dto)
    return data
  }

  async function updateIncomeExpense(id: number, dto: Partial<AddIncomeStateSchemaForScenario>) {
    const { data } = await apiClient.put(`income_expense/${id}`, dto)
    return data
  }

  async function fetchIncomeExpenses() {
    const { data } = await apiClient.get<Array<IncomeStatement & { isNew: boolean }>>('income_expense/')
    return data
  }

  async function deleteIncomeExpense(id: number) {
    const { data } = await apiClient.delete(`income_expense/${id}`)
    return data
  }

  async function fetchLiabilities() {
    const { data } = await apiClient.get<Liability[]>('loans/')
    return data
  }

  async function addLiability(dto: AddLiabilitySchema) {
    const { data } = await apiClient.post('loans/', dto)
    return data
  }

  async function editLiability(id: number, dto: Partial<AddLiabilitySchema>) {
    const { data } = await apiClient.put(`loans/${id}`, dto)
    return data
  }

  async function deleteLiability(id: number) {
    const { data } = await apiClient.delete(`loans/${id}`)
    return data
  }

  async function fetchPhysicalAssets() {
    const { data } = await apiClient.get<PhysicalAsset[]>('physical_assets/')
    return data
  }

  async function deletePhysicalAsset(id: number) {
    const { data } = await apiClient.delete<{ message: string }>(`/physical_assets/${id}`)
    return data
  }

  async function addPhysicalAsset(dto: AddPhysicalAssetSchemaForScenario) {
    const { data } = await apiClient.post<PhysicalAsset[]>('/physical_assets/', dto)
    return data
  }

  async function editPhysicalAsset(id: number, dto: Partial<AddPhysicalAssetSchemaForScenario>) {
    const { data } = await apiClient.put(`physical_assets/${id}`, dto)
    return data
  }

  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: [`${INCOME_STATEMENT.IS_EXPENSES}-${username}`],
    queryFn: fetchIncomeExpenses,
  })
  const { data: liabilities, isLoading: isLoadingLiabilities } = useQuery({
    queryKey: [`${BALANCE_SHEET.LIABILITIES}-${username}`],
    queryFn: fetchLiabilities,
  })
  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: [`${BALANCE_SHEET.ASSETS}-${username}`],
    queryFn: fetchPhysicalAssets,
  })

  if (isLoadingAssets || isLoadingExpenses || isLoadingLiabilities) {
    return <LoadingSkeleton />
  }

  return (
    <div className='flex flex-col'>
      <div>
        {!expenses?.length && !liabilities?.length && !assets?.length ? (
          <div className='mb-5'>
            <p className='text-gray-500'>There are no expenses, liabilities or assets in this scenario.</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className='flex flex-wrap gap-5 justify-center sm:justify-start'>
        {expenses?.map((each: IncomeStatement) => (
          <EachIncomeExpenseForScenario
            incomeExpense={each}
            createIncomeExpense={createIncomeExpense}
            updateIncomeExpense={updateIncomeExpense}
            deleteIncomeExpense={deleteIncomeExpense}
            IS_AUTHENTICATED_USER={IS_AUTHENTICATED_USER}
            key={each?.id}
          />
        ))}
        {liabilities?.map((each: Liability) => (
          <EachLiabilityForScenario
            liability={each}
            key={each?.id}
            addLiability={addLiability}
            editLiability={editLiability}
            deleteLiability={deleteLiability}
            IS_AUTHENTICATED_USER={IS_AUTHENTICATED_USER}
          />
        ))}
        {assets?.map((each: PhysicalAsset) => (
          <EachAsset
            key={each?.id}
            asset={each}
            createAsset={addPhysicalAsset}
            updateAsset={editPhysicalAsset}
            deleteAsset={deletePhysicalAsset}
            IS_AUTHENTICATED_USER={IS_AUTHENTICATED_USER}
          />
        ))}
        {IS_AUTHENTICATED_USER && IS_MY_SCENARIO && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant={'ghost'} className='border border-dashed rounded-lg p-20'>
                <PlusIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col' onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem className='cursor-pointer' asChild>
                <AddOrEditAssetsForScenario
                  trigger={<Button variant={'ghost'}>Asset</Button>}
                  addAsset={addPhysicalAsset}
                  editAsset={editPhysicalAsset}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer' asChild>
                <AddOrEditLiabilityDialog
                  trigger={<Button variant={'ghost'}>Liability</Button>}
                  addLiability={addLiability}
                  editLiability={editLiability}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer' asChild>
                <AddOrEditIncomeExpenseForScenario
                  trigger={<Button variant={'ghost'}>Monthly Expense</Button>}
                  type='EXPENSE'
                  createMutationFn={createIncomeExpense}
                  updateMutationFn={updateIncomeExpense}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default CreateButton
