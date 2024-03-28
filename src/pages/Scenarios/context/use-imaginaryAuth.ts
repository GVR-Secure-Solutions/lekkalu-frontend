import constate from 'constate'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { loginImaginaryUser } from '@/queries/auth'
import { AUTH } from '@/utils/query-keys'

export type ImaginaryUser = {
  [key: string]: { refresh: string; access: string; id: number }
}

export function useImaginaryAuth() {
  const qc = useQueryClient()
  const [imaginaryUsers, setImaginaryUsers] = useState<ImaginaryUser>({})
  const { data: imag_users } = useQuery<ImaginaryUser>([AUTH.IMAGINARY_CLIENT])

  const loginImaginaryUserMutation = useMutation(loginImaginaryUser, {
    onSuccess: (data) => {
      qc.setQueryData([AUTH.IMAGINARY_CLIENT], {
        ...(imag_users as unknown as object),
        [data?.username]: { access: data?.access, refresh: data?.refresh, id: data?.id },
      })
      qc.setQueryData([AUTH.CURRENT_IMAGINARY_USER], data.username)
    },
  })

  const getAPIClientForImaginaryUser = (token: string) => {
    const apiClient = axios.create({
      baseURL: process.env.REACT_APP_V1_API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return apiClient
  }

  return {
    imaginaryUsers,
    setImaginaryUsers,
    loginImaginaryUser: loginImaginaryUserMutation,
    getAPIClientForImaginaryUser,
  }
}

export const [ImaginaryAuthProvider, useImaginaryContext] = constate(useImaginaryAuth)
