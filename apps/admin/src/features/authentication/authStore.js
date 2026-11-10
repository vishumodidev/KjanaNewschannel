import { adminApiClient } from '../../lib/adminApiClient.js'

let accessToken = null

export const authStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token) => {
    accessToken = token
  },
  getUser: () => {
    try {
      const stored = localStorage.getItem('jana_admin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem('jana_admin_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('jana_admin_user')
    }
  },
  clear: () => {
    accessToken = null
    localStorage.removeItem('jana_admin_user')
  },
}

export async function login({ email, password }) {
  const response = await adminApiClient.post('/auth/login', { email, password })
  const { user, accessToken: token } = response.data
  authStore.setAccessToken(token)
  authStore.setUser(user)
  return user
}

export async function logout() {
  try {
    await adminApiClient.post('/auth/logout')
  } finally {
    authStore.clear()
  }
}

export async function refreshSession() {
  try {
    const response = await adminApiClient.post('/auth/refresh')
    const { accessToken: token } = response.data
    authStore.setAccessToken(token)
    return token
  } catch (err) {
    authStore.clear()
    throw err
  }
}
