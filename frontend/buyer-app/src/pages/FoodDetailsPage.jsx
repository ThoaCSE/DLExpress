import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchFoodById } from '../service/foodService'
import { addCartItem, getCart, setCartItemQuantity } from '../utils/cart'

const fallbackImg =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'

const getQty = (id) => {
  const item = getCart().find((x) => x.foodItemId === id)
  return item?.quantity || 0
}

export default function FoodDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(() => getQty(id))
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchFoodById(id).then((data) => {
      setFood(data)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    const refresh = () => setQty(getQty(id))
    window.addEventListener('dlexpress-cart-changed', refresh)
    return () => window.removeEventListener('dlexpress-cart-changed', refresh)
  }, [id])

  const handleAdd = () => {
    if (!food) return
    addCartItem({
      foodItemId: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      storeId: food.storeId,
      imageUrl: food.imageUrl,
      description: food.description,
      category: food.category,
    })
    setFlash(true)
    setTimeout(() => setFlash(false), 1500)
  }

  const increase = () => setCartItemQuantity(id, getQty(id) + 1)
  const decrease = () => setCartItemQuantity(id, Math.max(0, getQty(id) - 1))

  if (loading) {
    return (
      <div className="text-center my-5 py-5 w-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="container mt-5 text-center py-5">
        <h3 className="text-danger">Product Not Found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="container my-5 py-3">
      {/* Back link */}
      <Link
        to={food.storeId ? `/stores/${food.storeId}` : '/groceries'}
        className="d-inline-flex align-items-center gap-1 text-secondary mb-4 text-decoration-none small fw-semibold"
      >
        <i className="bi bi-arrow-left" /> Back
      </Link>

      <div className="row align-items-center justify-content-center g-5">
        {/* Image */}
        <div className="col-12 col-md-5 d-flex justify-content-center">
          <div
            className="card border-0 shadow-sm overflow-hidden p-3 bg-white"
            style={{ borderRadius: '16px', maxWidth: '400px', width: '100%' }}
          >
            <img
              src={food.imageUrl || fallbackImg}
              alt={food.name}
              onError={(e) => { e.target.src = fallbackImg }}
              className="img-fluid rounded"
              style={{ maxHeight: '360px', objectFit: 'contain', width: '100%' }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="col-12 col-md-6">
          {/* Category badge */}
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="text-secondary fw-semibold">Category:</span>
            <span className="badge bg-warning text-dark px-3 py-1 rounded fw-bold fs-6">
              {food.category || 'General'}
            </span>
          </div>

          <h2 className="fw-bold text-dark mb-3 lh-sm" style={{ fontSize: '2rem' }}>
            {food.name}
          </h2>

          {/* Price + rating */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <span className="h2 mb-0 fw-bold text-success">
              €{(food.price || 0).toFixed(2)}
            </span>
            <div className="text-warning d-flex align-items-center fs-5">
              <i className="bi bi-star-fill me-1" />
              <i className="bi bi-star-fill me-1" />
              <i className="bi bi-star-fill me-1" />
              <i className="bi bi-star-fill me-1" />
              <i className="bi bi-star-half me-2" />
              <span className="text-muted small fs-6">(4.5)</span>
            </div>
          </div>

          <hr className="my-4 text-muted" />

          <h5 className="fw-bold text-secondary mb-2">Product Description</h5>
          <p className="text-muted lh-base mb-4 fs-6" style={{ textAlign: 'justify' }}>
            {food.description || 'Fresh premium item sourced for quality assurance.'}
          </p>

          {/* Cart controls */}
          <div className="d-flex align-items-center gap-3 pt-2">
            {qty > 0 ? (
              <div
                className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill border"
                style={{ borderColor: '#99D9F2' }}
              >
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={decrease}
                >
                  −
                </button>
                <span className="fw-bold px-2">{qty}</span>
                <button
                  className="btn btn-sm"
                  onClick={increase}
                  style={{ backgroundColor: '#99D9F2', border: 'none' }}
                >
                  +
                </button>
              </div>
            ) : (
              <button
                className="btn px-4 py-2 rounded-pill fw-bold shadow-sm d-flex align-items-center gap-2"
                type="button"
                onClick={handleAdd}
                style={{ backgroundColor: '#99D9F2', border: 'none', color: '#1f2937', minWidth: '180px' }}
              >
                <i className="bi bi-cart-plus-fill" />
                {flash ? 'Added!' : 'Add To Cart'}
              </button>
            )}

            <button
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center rounded-circle"
              type="button"
              style={{ width: '42px', height: '42px', padding: '0' }}
            >
              <i className="bi bi-heart" />
            </button>
          </div>

          {qty > 0 && (
            <Link to="/cart" className="btn btn-outline-danger btn-sm mt-3 rounded-pill">
              <i className="bi bi-cart me-1" />View Cart ({qty} in cart)
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
