const authKey = 'dlexpress_admin_auth'

export const getAuth = () => {
	try {
		return JSON.parse(localStorage.getItem(authKey) || 'null')
	} catch {
		return null
	}
}

export const setAuth = (d) => {
	localStorage.setItem(authKey, JSON.stringify(d))
	window.dispatchEvent(new Event('dlexpress-auth-changed'))
}

export const logout = () => {
	localStorage.removeItem(authKey)
	window.dispatchEvent(new Event('dlexpress-auth-changed'))
	window.location.href = '/login'
}

export const getToken = () => getAuth()?.token || null
