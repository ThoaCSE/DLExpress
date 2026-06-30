import React, { useRef } from 'react'
import { categories } from '../assets/categories'

export default function CategoryCarousel({ category, setCategory }) {
  const rowRef = useRef(null)

  const scrollLeft = () => rowRef.current?.scrollBy({ left: -750, behavior: 'smooth' })
  const scrollRight = () => rowRef.current?.scrollBy({ left: 750, behavior: 'smooth' })

  return (
    <div className="category-carousel container mt-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
        <div>
          <h2 className="mb-0 fw-bold text-dark">Explore Our Menu</h2>
          <p className="text-muted small mb-0 mt-1">Browse curated lists of dishes from top categories</p>
        </div>
        <div className="d-flex gap-2">
          <i
            className="bi bi-arrow-left-circle fs-3 text-secondary"
            onClick={scrollLeft}
            style={{ cursor: 'pointer' }}
          />
          <i
            className="bi bi-arrow-right-circle fs-3 text-secondary"
            onClick={scrollRight}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>

      <div
        className="d-flex gap-4 overflow-auto py-3 category-scroll-row"
        ref={rowRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* All */}
        <div
          className="text-center flex-shrink-0 category-item"
          onClick={() => setCategory('All')}
          style={{ width: 120, cursor: 'pointer' }}
        >
          <div
            className={`rounded-circle d-flex align-items-center justify-content-center mx-auto category-img-wrap ${category === 'All' ? 'category-active' : ''}`}
            style={{ width: 100, height: 100, background: '#f8f0f4', fontSize: 36 }}
          >
            🍽️
          </div>
          <p className="mt-2 fw-bold text-secondary small">All</p>
        </div>

        {categories.map((item, index) => {
          const isActive = category === item.category
          return (
            <div
              key={index}
              className="text-center flex-shrink-0 category-item"
              onClick={() => setCategory((prev) => (prev === item.category ? 'All' : item.category))}
              style={{ width: 120, cursor: 'pointer' }}
            >
              <img
                src={item.icon}
                alt={item.category}
                className={`rounded-circle category-img-wrap ${isActive ? 'category-active' : ''}`}
                style={{ height: 100, width: 100, objectFit: 'cover' }}
              />
              <p className="mt-2 fw-bold text-secondary small lh-sm px-1" style={{ wordBreak: 'break-word' }}>
                {item.category}
              </p>
            </div>
          )
        })}
      </div>
      <hr className="text-muted" />
    </div>
  )
}
