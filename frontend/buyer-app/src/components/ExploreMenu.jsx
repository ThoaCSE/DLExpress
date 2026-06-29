import React from 'react'

const CATEGORIES = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Snacks', 'Drinks']

export default function ExploreMenu({ category, setCategory, searchText, setSearchText }) {
  return (
    <section className="explore-menu mb-4">
      <div className="promo-strip mb-3">
        <i className="bi bi-megaphone-fill me-2" />
        New customer offer: get free delivery on your first 2 orders.
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div className="category-row">
          {CATEGORIES.map((item) => (
            <button
              type="button"
              key={item}
              className={`btn btn-sm ${category === item ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="search-bar w-100 w-md-auto">
          <input
            type="search"
            className="form-control"
            placeholder="Search stores..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
    </section>
  )
}
