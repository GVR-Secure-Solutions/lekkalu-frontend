import { v1ApiClient } from '@/utils/client'
import { Comparison } from '@/types/comparison'
import { AddComaprisonSchema } from '@/schema/comparisons'

export async function fetchComparisons() {
  const { data } = await v1ApiClient.get<Comparison[]>('/comparison/')
  return data
}

export async function createComparisons(dto: AddComaprisonSchema) {
  const { data } = await v1ApiClient.post<Comparison>('/comparison/', dto)
  return data
}

export async function fetchComparisonsById(id: number) {
  const { data } = await v1ApiClient.get<Comparison>(`/comparison/${id}`)
  return data
}

export async function editComparisons(id: number, dto: Partial<Comparison>) {
  const { data } = await v1ApiClient.put<Comparison>(`/comparison/${id}`, dto)
  return data
}

export async function deleteComparisons(id: number) {
  const { data } = await v1ApiClient.delete<Comparison>(`/comparison/${id}`)
  return data
}
