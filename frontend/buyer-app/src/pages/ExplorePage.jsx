import React, { useState } from 'react'
import { categories } from '../assets/categories'
import CategoryCarousel from '../components/CategoryCarousel'
import FoodDisplay from '../components/FoodDisplay'

export default function ExplorePage() {
  const [category, setCategory] = useState('All')
  const [searchText, setSearchText] = useState('')
  const [inputValue, setInputValue] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchText(inputValue)
  }

  return (
    <div>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-8 col-lg-6">
          <form onSubmit={handleSearch}>
            <div className="input-group shadow-sm">
              <select
                className="form-select fw-semibold text-secondary"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ maxWidth: 180, cursor: 'pointer' }}
              >
                <option value="All">All Categories</option>
                {categories.map((item, idx) => (
                  <option key={idx} value={item.category}>{item.category}</option>
                ))}
              </select>
              <input
                type="text"
                className="form-control py-2 px-3"
                placeholder="Search your favourite dish..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                className="btn text-white px-3"
                type="submit"
                style={{ backgroundColor: '#dc3545', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className="bi bi-search" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <CategoryCarousel category={category} setCategory={setCategory} />
      <FoodDisplay category={category} searchText={searchText} />
    </div>
  )
}
