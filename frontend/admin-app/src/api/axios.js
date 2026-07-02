import axios from 'axios'
import { getAuth, getToken, logout } from '../utils/auth'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(cfg => {
  const t = getToken()
  if (t) cfg.headers.Authorization = `Bearer ${t}`
  const a = getAuth()
  if (a?.userId) cfg.headers['X-User-Id'] = a.userId
  return cfg
})

api.interceptors.response.use(
  r => r,
  e => {
    const status = e.response?.status
    if (status === 401) {
      logout()
      window.location.href = '/login'
    }
    if (status === 403) {
      console.error('[Admin] 403 Forbidden – token may be invalid or session expired. Please log in again.')
    }
    return Promise.reject(e)
  }
)

export default api
