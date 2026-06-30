import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { addCartItem, getCart, getCartItemCount, setCartItemQuantity } from '../utils/cart'

const fallbackImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'

function getQty(id) {
  return getCart().find((x) => x.foodItemId === id)?.quantity || 0
}

export default function StorePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const [store, setStore] = useState(null)
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [, forceUpdate] = useState(0)
  const [cartCount, setCartCount] = useState(getCartItemCount())

  useEffect(() => {
    Promise.all([
      axios.get(`/api/stores/${id}`).catch(() => ({ data: null })),
      axios.get(`/api/foods/store/${id}`).catch(() => ({ data: { data: [] } })),
    ]).then(([storeRes, foodsRes]) => {
      setStore(storeRes.data?.data || storeRes.data)
      setFoods(foodsRes.data?.data || foodsRes.data || [])
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    const refresh = () => { setCartCount(getCartItemCount()); forceUpdate((n) => n + 1) }
    window.addEventListener('dlexpress-cart-changed', refresh)
    return () => window.removeEventListener('dlexpress-cart-changed', refresh)
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(foods.map((f) => f.category).filter(Boolean))]
    return ['All', ...cats.sort()]
  }, [foods])

  const filtered = useMemo(() => foods.filter((f) => {
    const matchCat = category === 'All' || f.category === category
    const matchSearch = !search || (f.name || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  }), [foods, category, search])

  const handleAdd = (food) => {
    addCartItem({ foodItemId: food.id, name: food.name, price: food.price, quantity: 1, storeId: id, imageUrl: food.imageUrl, description: food.description, category: food.category })
  }

  const increase = (food) => {
    const q = getQty(food.id)
    q === 0 ? handleAdd(food) : setCartItemQuantity(food.id, q + 1)
  }

  const decrease = (food) => setCartItemQuantity(food.id, Math.max(0, getQty(food.id) - 1))

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>

  return (
    <div>
      {/* Store header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/stores" className="btn btn-outline-secondary btn-sm rounded-pill">
          <i className="bi bi-arrow-left me-1" />Stores
        </Link>
        <div>
          <h4 className="mb-0 fw-bold">{store?.name || 'Store Menu'}</h4>
          {store?.address && <small className="text-muted"><i className="bi bi-geo-alt me-1" />{store.address}</small>}
        </div>
        <Link to="/cart" className="btn btn-outline-danger btn-sm rounded-pill ms-auto">
          <i className="bi bi-cart me-1" />Cart {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
        </Link>
      </div>

      {/* Search + category filter */}
      <div className="mb-3">
        <div className="input-group shadow-sm mb-3" style={{ maxWidth: 480 }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search in this store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="btn btn-outline-secondary" onClick={() => setSearch('')}>
              <i className="bi bi-x" />
            </button>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill ${category === cat ? 'btn-danger' : 'btn-outline-secondary'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food grid */}
      {!filtered.length ? (
        <div className="text-center py-5 text-muted">No items found for this selection.</div>
      ) : (
        <div className="row g-3">
          {filtered.map((f) => {
            const qty = getQty(f.id)
            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={f.id}>
                <div className="card h-100 shadow-sm">
                  <Link to={`/food/${f.id}`}>
                    <img
                      src={f.imageUrl || fallbackImg}
                      className="card-img-top"
                      alt={f.name}
                      onError={(e) => { e.target.src = fallbackImg }}
                      style={{ height: 160, objectFit: 'cover', cursor: 'pointer' }}
                    />
                  </Link>
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-bold text-truncate mb-1">{f.name}</h6>
                    <p className="text-muted small mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {f.description}
                    </p>
                    {f.category && <span className="badge bg-light text-primary border small mb-2">{f.category}</span>}
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                      <strong className="text-success">€{(f.price || 0).toFixed(2)}</strong>
                      {qty > 0 ? (
                        <div className="d-flex align-items-center gap-1">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => decrease(f)}>−</button>
                          <span className="fw-bold px-1">{qty}</span>
                          <button className="btn btn-sm btn-danger" onClick={() => increase(f)}>+</button>
                        </div>
                      ) : (
                        <button className="btn btn-danger btn-sm" onClick={() => handleAdd(f)}>
                          <i className="bi bi-cart-plus me-1" />Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Floating checkout bar */}
      {cartCount > 0 && (
        <div className="position-fixed bottom-0 start-0 end-0 p-3 bg-white border-top shadow d-flex justify-content-between align-items-center" style={{ zIndex: 1040 }}>
          <span className="fw-semibold">{cartCount} item(s) in cart</span>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger btn-sm rounded-pill" onClick={() => nav('/cart')}>View Cart</button>
            <button className="btn btn-danger btn-sm rounded-pill" onClick={() => nav('/checkout')}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  )
}

