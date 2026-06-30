import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { addCartItem } from '../utils/cart'

export default function GroceriesPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/groceries/categories')
      .then((res) => setCategories(res.data?.data || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (query.trim()) params.append('query', query.trim())
    if (category !== 'All') params.append('category', category)
    params.append('limit', '90')

    axios.get(`/api/groceries/items?${params.toString()}`)
      .then((res) => setItems(res.data?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [category, query])

  const topCategories = useMemo(() => ['All', ...categories.slice(0, 12)], [categories])

  const add = (item) => {
    addCartItem({
      foodItemId: item.id,
      storeId: item.storeId,
      name: item.name,
      description: item.description,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
      category: item.category,
    })
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Groceries Catalog</h3>
          <p className="text-muted mb-0">Imported from partner grocery datasets and ready to shop.</p>
        </div>
        <input
          className="form-control"
          style={{ maxWidth: 340 }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search groceries..."
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {topCategories.map((item) => (
          <button
            key={item}
            className={`btn btn-sm ${category === item ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
      ) : !items.length ? (
        <div className="text-center py-5 text-muted">No grocery items found.</div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-md-4 col-lg-3" key={item.id}>
              <div className="card shadow-sm h-100">
                <img
                  src={item.imageUrl || 'https://via.placeholder.com/400x220?text=Groceries'}
                  alt={item.name}
                  className="card-img-top"
                  style={{ height: 150, objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <div className="small text-muted mb-1">{item.market || 'Market'} • {item.brand || 'Brand'}</div>
                  <h6 className="mb-1">{item.name}</h6>
                  <p className="text-muted small flex-grow-1">{item.description || 'Fresh grocery product.'}</p>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary">{item.category || 'Groceries'}</span>
                    <div>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <small className="text-muted text-decoration-line-through me-1">€{item.originalPrice.toFixed(2)}</small>
                      )}
                      <strong className="text-danger">€{item.price.toFixed(2)}</strong>
                    </div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => add(item)}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
