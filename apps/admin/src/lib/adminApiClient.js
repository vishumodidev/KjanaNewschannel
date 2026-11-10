import axios from 'axios'
import { authStore } from '../features/authentication/authStore.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends HttpOnly refreshToken cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

// ── Request interceptor ───────────────────────────────────────────────────────
adminApiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────────────────
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

adminApiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const message = error.response?.data?.error?.message ?? error.message ?? 'Network error'
    const code = error.response?.data?.error?.code ?? 'NETWORK_ERROR'
    const details = error.response?.data?.error?.details ?? null

    // Don't loop refresh on login or refresh endpoints
    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return adminApiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshRes = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const newToken = refreshRes.data?.data?.accessToken
        if (newToken) {
          authStore.setAccessToken(newToken)
          processQueue(null, newToken)
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return adminApiClient(originalRequest)
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null)
        authStore.clear()
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject({ message, code, status, details })
  },
)

export default adminApiClient
