import axios from 'axios'

// ── Public API client ─────────────────────────────────────────────────────────
// Used by the public news website to fetch published content.
// Access tokens are NOT needed for public endpoints.
// Phase 2 will add the request / response interceptors for authentication.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Needed for refresh token cookie in reader auth (Phase 6)
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15_000, // 15 seconds
})

// ── Request interceptor ───────────────────────────────────────────────────────
// Phase 2+: attach bearer token for authenticated reader routes (bookmarks, etc.)
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// ── Response interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data, // Unwrap envelope so callers get { success, data, meta }
  (error) => {
    const message =
      error.response?.data?.error?.message ?? error.message ?? 'Network error'
    const code = error.response?.data?.error?.code ?? 'NETWORK_ERROR'
    const status = error.response?.status ?? 0

    // Return a normalised error object
    return Promise.reject({ message, code, status })
  },
)

export default apiClient

