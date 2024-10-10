import axios from 'axios'
import { QueryClient } from '@tanstack/react-query'
import { GraphQLClient } from 'graphql-request'
import { HTTPMethodInput } from 'node_modules/graphql-request/build/legacy/helpers/types'
import { getCookie } from './cookie'

const BASIC_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

/**
 * This is general api client which will be used for most of the stuff
 */
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: BASIC_HEADER,
})

apiClient?.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${getCookie('access')}`
  }

  return config
})

/**
 * This is for user specific requests
 */
export const userClient = axios.create({
  baseURL: process.env.REACT_APP_USER_BASE_URL,
  headers: BASIC_HEADER,
})

/**
 * This is for google auth specific requests
 */
export const googleClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: BASIC_HEADER,
})

/**
 * This is for token specific requests
 */
export const tokenClient = axios.create({
  baseURL: process.env.REACT_APP_TOKEN_BASE_URL,
  headers: BASIC_HEADER,
})

/**
 * Api client for v1 where NO token is required
 */

export const v1ApiClientWithoutToken = axios.create({
  baseURL: process.env.REACT_APP_V1_API_URL,
  headers: BASIC_HEADER,
})

/**
 * Api client for v1 where token is required (below end point have interceptor with token)
 */

export const v1ApiClient = axios.create({
  baseURL: process.env.REACT_APP_V1_API_URL,
  headers: BASIC_HEADER,
})
v1ApiClient?.interceptors.request.use((config) => {
  if (!config.headers.Authorization && getCookie('access')) {
    config.headers.Authorization = `Bearer ${getCookie('access')}`
  }

  return config
})

/**
 * Api client for v2
 */
export const v2ApiClient = axios.create({
  baseURL: process.env.REACT_APP_V2_API_URL,
  headers: BASIC_HEADER,
})
v2ApiClient?.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${getCookie('access')}`
  }

  return config
})

/** For resend-email-verification request */

export const registrationClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: BASIC_HEADER,
})
registrationClient?.interceptors.request.use((config) => {
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${getCookie('access')}`
  }

  return config
})

export const queryClient = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false } } })

export function getGraphQLClient(method: HTTPMethodInput) {
  const graphqlClient = new GraphQLClient(process.env.REACT_APP_GRAPHQL_URL as unknown as string, {
    headers: {
      Authorization: `Bearer ${getCookie('access')}`,
    },
    method,
    excludeOperationName: true,
  })
  return graphqlClient
}
