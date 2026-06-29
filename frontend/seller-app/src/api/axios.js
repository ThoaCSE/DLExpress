import axios from 'axios'
import { getAuth, getToken, logout } from '../utils/auth'
const api = axios.create({ baseURL: '/api' })
api.interceptors.request.use(cfg => {
  const t=getToken(); if(t) cfg.headers.Authorization=`Bearer ${t}`
  const a = getAuth()
  if(a?.userId) cfg.headers['X-User-Id']=a.userId
  return cfg
})
api.interceptors.response.use(r=>r, e=>{ if(e.response?.status===401) logout(); return Promise.reject(e) })
export default api
