import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StoreContext } from '../context/StoreContext'

const BADGES = ['🔥 Hot Deal', '⭐ Top Pick', '🎯 Featured']
const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'

export default function DealsForToday() {
  const { foodList } = useContext(StoreContext)

  const featured = useMemo(() => {
    if (!foodList.length) return []
    // prefer items that have an imageUrl; spread picks across the full list
    const pool = foodList.filter((f) => f.imageUrl).length >= 3
      ? foodList.filter((f) => f.imageUrl)
      : foodList
    const step = Math.max(1, Math.floor(pool.length / 3))
    return [0, 1, 2]
      .map((i) => pool[Math.min(i * step, pool.length - 1)])
      .filter(Boolean)
  }, [foodList])

  if (!featured.length) return null

  return (
    <section className="deals-section mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">Deals for Today</h2>
          <p className="text-muted mb-0">Fresh picks from local sellers.</p>
        </div>
        <Link to="/explore" className="btn btn-outline-danger btn-sm rounded-pill">Browse all</Link>
      </div>
      <div className="row g-3">
        {featured.map((food, i) => (
          <div className="col-md-4" key={food.id}>
            <div className="card shadow-sm h-100 overflow-hidden">
              <div className="position-relative">
                <img
                  src={food.imageUrl || fallback}
                  alt={food.name}
                  onError={(e) => { e.target.src = fallback }}
                  style={{ width: '100%', height: 180, objectFit: 'cover' }}
                />
                <span className="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill">
                  {BADGES[i]}
                </span>
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold mb-1 text-truncate">{food.name}</h5>
                <p
                  className="text-muted small mb-2"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {food.description || food.category}
                </p>
                {food.category && (
                  <span className="badge bg-light text-primary border small mb-2" style={{ width: 'fit-content' }}>
                    {food.category}
                  </span>
                )}
                <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                  <span className="h6 mb-0 fw-bold text-success">€{(food.price || 0).toFixed(2)}</span>
                  <Link to={`/food/${food.id}`} className="btn btn-danger btn-sm rounded-pill">
                    Shop now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

