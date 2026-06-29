const authKey = 'dlexpress_auth'

export const getAuth = () => {
	try {
		return JSON.parse(sessionStorage.getItem(authKey) || 'null')
	} catch {
		return null
	}
}

export const setAuth = (d) => {
	sessionStorage.setItem(authKey, JSON.stringify(d))
	window.dispatchEvent(new Event('dlexpress-auth-changed'))
}

export const logout = () => {
	sessionStorage.removeItem(authKey)
	window.dispatchEvent(new Event('dlexpress-auth-changed'))
}

export const getToken = () => getAuth()?.token || null
