export const getAuth = () => { try { return JSON.parse(localStorage.getItem('dlexpress_auth')||'null') } catch { return null } }
export const setAuth = d => localStorage.setItem('dlexpress_auth', JSON.stringify(d))
export const logout  = () => { localStorage.removeItem('dlexpress_auth'); window.location.href='/login' }
export const getToken= () => getAuth()?.token||null
