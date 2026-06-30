import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import FoodItem from './FoodItem'

export default function FoodDisplay({ category = 'All', searchText = '', storeId }) {
  const { foodList } = useContext(StoreContext)

  const filteredFoods = foodList.filter((food) => {
    const matchesCategory = category === 'All' || food.category === category
    const matchesSearch = !searchText || (food.name || '').toLowerCase().includes(searchText.toLowerCase())
    const matchesStore = !storeId || food.storeId === storeId
    return matchesCategory && matchesSearch && matchesStore
  })

  if (!foodList.length) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Fetching products from database...</p>
      </div>
    )
  }

  if (!filteredFoods.length) {
    return <div className="text-center py-5 text-muted">No items found for this selection.</div>
  }

  return (
    <div className="container mt-4" id="food-display">
      <h2 className="mb-4 fw-bold text-dark">Top dishes near you</h2>
      <div className="row">
        {filteredFoods.map((food) => (
          <FoodItem key={food.id} {...food} />
        ))}
      </div>
    </div>
  )
}
