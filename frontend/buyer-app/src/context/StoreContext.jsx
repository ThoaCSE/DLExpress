import { createContext, useEffect, useState } from 'react'
import { fetchFoodList } from '../service/foodService'

export const StoreContext = createContext(null)

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([])

  useEffect(() => {
    fetchFoodList().then(setFoodList)
  }, [])

  return (
    <StoreContext.Provider value={{ foodList }}>
      {children}
    </StoreContext.Provider>
  )
}
