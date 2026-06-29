export const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem('dlexpress_auth') || 'null')
  } catch {
    return null
  }
}

export const setAuth = (d) => {
  localStorage.setItem('dlexpress_auth', JSON.stringify(d))
  window.dispatchEvent(new Event('dlexpress-auth-changed'))
}

export const logout = () => {
  localStorage.removeItem('dlexpress_auth')
  window.dispatchEvent(new Event('dlexpress-auth-changed'))
  window.location.href = '/login'
}

export const getToken = () => getAuth()?.token || null
