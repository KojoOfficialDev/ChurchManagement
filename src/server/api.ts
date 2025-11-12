import axios from 'axios'

export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://testapi.catholicportal.net/api/v1.1'
    : 'http://testapi.catholicportal.net/api/v1.1'

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
