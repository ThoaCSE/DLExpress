export const getAuth  = () => { try { return JSON.parse(localStorage.getItem('foodie_auth')||'null') } catch { return null } }
export const setAuth  = d  => localStorage.setItem('foodie_auth', JSON.stringify(d))
export const logout   = () => { localStorage.removeItem('foodie_auth'); window.location.href='/login' }
export const getToken = () => getAuth()?.token||null
