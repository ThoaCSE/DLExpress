import React, { useState } from 'react'
import Header from '../components/Header'
import CategoryCarousel from '../components/CategoryCarousel'
import FoodDisplay from '../components/FoodDisplay'
import DealsForToday from '../components/DealsForToday'

export default function HomePage() {
  const [category, setCategory] = useState('All')

  return (
    <>
      <Header />
      <CategoryCarousel category={category} setCategory={setCategory} />
      <FoodDisplay category={category} searchText="" />
      <DealsForToday />
    </>
  )
}
