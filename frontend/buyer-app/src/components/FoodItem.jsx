import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { addCartItem, getCart, setCartItemQuantity } from '../utils/cart'

const getQty = (id) => {
  const item = getCart().find((x) => x.foodItemId === id)
  return item?.quantity || 0
}

export default function FoodItem({ id, name, description, category, imageUrl, price, market, storeId }) {
  const [qty, setQty] = useState(() => getQty(id))

  useEffect(() => {
    const refresh = () => setQty(getQty(id))
    window.addEventListener('dlexpress-cart-changed', refresh)
    return () => window.removeEventListener('dlexpress-cart-changed', refresh)
  }, [id])

  const handleAdd = () => {
    addCartItem({ foodItemId: id, name, price, quantity: 1, storeId, imageUrl, description, category })
  }

  const increase = () => setCartItemQuantity(id, getQty(id) + 1)

  const decrease = () => setCartItemQuantity(id, Math.max(0, getQty(id) - 1))

  const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card h-100 shadow-sm" style={{ maxWidth: 320, width: '100%' }}>
        <Link to={`/food/${id}`}>
          <img
            src={imageUrl || fallback}
            className="card-img-top"
            alt={name || 'Food Item'}
            onError={(e) => { e.target.src = fallback }}
            style={{ height: 200, objectFit: 'cover', cursor: 'pointer' }}
          />
        </Link>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <h5 className="card-title fw-bold text-dark text-truncate">{name}</h5>
            <p
              className="card-text text-muted small"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {description}
            </p>
            <span className="badge bg-light text-primary border mb-2">{category}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="h5 mb-0 fw-bold text-success">€{(price || 0).toFixed(2)}</span>
            <div className="text-warning small">
              <i className="bi bi-star-fill" /><i className="bi bi-star-fill" /><i className="bi bi-star-fill" />
              <i className="bi bi-star-fill" /><i className="bi bi-star-half" />
              <small className="text-muted"> (4.5)</small>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center bg-light border-top-0 py-3">
          <Link
            to={`/food/${id}`}
            className="btn btn-sm btn-outline-primary me-2"
            style={{ flex: '0 0 auto' }}
          >
            View
          </Link>
          {qty > 0 ? (
            <div className="d-flex align-items-center gap-1">
              <button className="btn btn-sm btn-outline-secondary" onClick={decrease}>−</button>
              <span className="px-2 fw-bold">{qty}</span>
              <button className="btn btn-sm btn-danger" onClick={increase}>+</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-danger" onClick={handleAdd}>
              <i className="bi bi-cart-plus me-1" />Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
