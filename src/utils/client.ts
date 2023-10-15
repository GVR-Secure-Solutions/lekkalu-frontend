import axios from 'axios'
import { QueryClient } from '@tanstack/react-query'
import { getCookie } from './cookie'

export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getCookie('access')}`

  return config
})

export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })
