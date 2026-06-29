import { createContext, useCallback, useEffect, useState } from 'react'
import { fetchFoodList } from '../service/foodService'
import { addToCart, getCartData, removeQtyFromCart } from '../service/cartService'
import { getAuth } from '../utils/auth'

export const StoreContext = createContext(null)

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([])
  const [quantities, setQuantities] = useState({})
  const [auth, setAuthState] = useState(() => getAuth())

  const syncAuth = useCallback(async () => {
    const current = getAuth()
    setAuthState(current)
    const foods = await fetchFoodList()
    setFoodList(foods)
    if (current?.token) {
      const items = await getCartData(current.token)
      if (items) setQuantities(items)
    }
  }, [])

  useEffect(() => {
    syncAuth()
    window.addEventListener('dlexpress-auth-changed', syncAuth)
    return () => window.removeEventListener('dlexpress-auth-changed', syncAuth)
  }, [syncAuth])

  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }))
    if (auth?.token) await addToCart(foodId, auth.token)
  }

  const decreaseQty = async (foodId) => {
    setQuantities((prev) => {
      const next = { ...prev }
      if (!next[foodId]) return next
      next[foodId] = Math.max(0, next[foodId] - 1)
      if (next[foodId] === 0) delete next[foodId]
      return next
    })
    if (auth?.token) await removeQtyFromCart(foodId, auth.token)
  }

  return (
    <StoreContext.Provider value={{ foodList, quantities, increaseQty, decreaseQty, auth }}>
      {children}
    </StoreContext.Provider>
  )
}
