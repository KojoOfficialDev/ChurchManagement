import axios from 'axios'
import { API_URL } from '@/lib/constants/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export const protectedApi = axios.create({
  baseURL: API_URL,

  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
