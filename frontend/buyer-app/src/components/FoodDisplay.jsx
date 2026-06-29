import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import FoodItem from './FoodItem'

export default function FoodDisplay({ category, searchText }) {
  const { foodList } = useContext(StoreContext)
  const filteredFoods = foodList.filter((food) => {
    const matchesCategory = category === 'All' || food.category === category
    const matchesSearch = food.name.toLowerCase().includes(searchText.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!filteredFoods.length) {
    return <div className="text-center py-5 text-muted">No items found for this search.</div>
  }

  return (
    <div className="food-grid">
      {filteredFoods.map((food) => (
        <FoodItem key={food.id} {...food} />
      ))}
    </div>
  )
}
