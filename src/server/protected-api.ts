import axios from 'axios'
import { sessionOptions } from '@/services/auth/queries'
import { RefreshToken } from '@/services/auth/refresh'
import { getContext } from '@/integrations/tanstack-query/root-provider'
import { API_URL } from '@/server/api'

export const protectedApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Flag to track if we're refreshing the token
let isRefreshing = false
// Queue to store failed requests while refreshing
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

// Process queue of failed requests
const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

// Get the query client instance
const queryClient = getContext().queryClient

// Add request interceptor
protectedApi.interceptors.request.use(
  async (config) => {
    // Get access token from session query
    const sessionData = await queryClient
      .ensureQueryData(sessionOptions)
      .catch(() => null)
    if (sessionData && sessionData.accessToken) {
      config.headers.Authorization = `Bearer ${sessionData.accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor
protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // If we're already refreshing, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(() => {
          return protectedApi(originalRequest)
        })
        .catch((err) => {
          return Promise.reject(err)
        })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // Refresh the session query which will get a new token
      const access_token = await RefreshToken()

      if (!access_token) {
        const { router } = await import('@/main')
        const location = router.state.location
        queryClient.removeQueries()
        const redirect = encodeURIComponent(location.href)
        return router.navigate({
          to: '/login',
          search: redirect ? { redirect } : undefined,
          state: location.state,
          replace: true,
        })
      }

      // Update authorization header
      protectedApi.defaults.headers.common['Authorization'] =
        `Bearer ${access_token}`
      originalRequest.headers['Authorization'] = `Bearer ${access_token}`

      // Process queue
      processQueue()

      // Retry original request
      return protectedApi(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
