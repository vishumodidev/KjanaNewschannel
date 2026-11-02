import axios from 'axios'

// ── Admin API client ──────────────────────────────────────────────────────────
// Used exclusively by the Admin CMS.
// Phase 2 adds:
//   - accessToken injection (from in-memory store)
//   - 401 → token refresh → retry logic
//   - redirect to /login on refresh failure

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

export const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Sends refresh-token cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000, // 30s — allow time for media uploads
})

// ── Request interceptor ───────────────────────────────────────────────────────
adminApiClient.interceptors.request.use(
  (config) => {
    // Phase 2: inject access token from in-memory auth store
    // const token = authStore.getAccessToken()
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────────────────
adminApiClient.interceptors.response.use(
  (response) => response.data, // Unwrap envelope
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.error?.message ?? error.message ?? 'Network error'
    const code = error.response?.data?.error?.code ?? 'NETWORK_ERROR'
    const details = error.response?.data?.error?.details ?? null

    if (status === 401) {
      // Phase 2: attempt token refresh; redirect to /login on failure
    }

    return Promise.reject({ message, code, status, details })
  },
)

export default adminApiClient

