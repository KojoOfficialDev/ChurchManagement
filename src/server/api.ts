import axios from 'axios'

// Use Vite's env API to ensure values are defined in the browser bundle
const BASE_URL = import.meta.env.VITE_BASE_URL
const BASE_PATH = import.meta.env.VITE_BASE_PATH

export const API_URL = `${BASE_URL}${BASE_PATH}`
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
