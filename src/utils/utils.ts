import { clsx, type ClassValue } from 'clsx'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const preventPropagationOnEnter = (event: React.KeyboardEvent<HTMLDivElement>) => {
  if (event.key === 'Enter') event.preventDefault()
}

export const getErrorMessage = (
  err: any,
): { title: string; description?: string; variant?: 'destructive' | 'default' } => {
  if (err?.response?.status) {
    switch (err?.response?.status) {
      case 400:
        return {
          title: 'Bad Request',
          description: 'The server could not understand the request due to invalid syntax or missing parameters.',
          variant: 'destructive',
        }
      case 401:
        return {
          title: 'Invalid Credentials!',
          description: 'Authentication is required, please provided valid credentials.',
          variant: 'destructive',
        }
      case 403:
        return {
          title: 'Forbidden',
          description: 'Permission denied. Check your access rights.',
          variant: 'destructive',
        }
      case 404:
        return {
          title: 'Not Found',
          description:
            'The server can not find the requested resource. This could be due to a deleted resource or an incorrect URL.',
          variant: 'destructive',
        }
      case 500:
        return {
          title: 'Something went wrong!',
          variant: 'destructive',
        }
      case 502:
        return {
          title: 'Bad Gateway',
          description: 'The server received an invalid response from an upstream server.',
          variant: 'destructive',
        }
      case 503:
        return {
          title: 'Service Unavailable',
          description:
            'The server is currently unable to handle the request due to temporary overloading or maintenance of the server.',
          variant: 'destructive',
        }
      case 504:
        return {
          title: 'Gateway Timeout',
          description:
            'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server or some other auxiliary server it needed to access in order to complete the request.',
          variant: 'destructive',
        }
      default:
        return { title: 'Unexpected error occurred', variant: 'destructive' }
    }
  } else {
    return { title: 'Unexpected error occurred', variant: 'destructive' }
  }
}

export function getPlural(number: number, unit: string) {
  return number > 1 ? `${unit}s` : unit
}
