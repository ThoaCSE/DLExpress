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
    if (status === 401) logout() // logout() already does window.location.href redirect
    return Promise.reject(e)
  }
)

export default api
