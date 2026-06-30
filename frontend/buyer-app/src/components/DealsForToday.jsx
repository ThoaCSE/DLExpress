import React from 'react'
import { Link } from 'react-router-dom'

const DEFAULT_DEALS = [
  { id: 'deal1', title: 'Vegetable Bundle', subtitle: 'Save €8 on fresh produce', tag: 'Bundle' },
  { id: 'deal2', title: 'Breakfast Box', subtitle: 'Fast delivery before 9 AM', tag: 'Top Seller' },
  { id: 'deal3', title: 'Snack Pack', subtitle: 'Perfect for movie night', tag: 'Limited Time' },
]

export default function DealsForToday({ promotions = [] }) {
  const deals = promotions.length
    ? promotions.map((p) => ({
        id: p.id,
        title: p.title || `${p.storeName} special`,
        subtitle: p.subtitle || 'Best seller bundle from this store',
        tag: p.badge || 'Seller Promo',
        storeId: p.storeId,
      }))
    : DEFAULT_DEALS

  return (
    <section className="deals-section mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">Deals for Today</h2>
          <p className="text-muted mb-0">Curated offers from local sellers.</p>
        </div>
      </div>
      <div className="row g-3">
        {deals.map((deal) => (
          <div className="col-md-4" key={deal.id}>
            <div className="deal-card p-4 rounded-4 shadow-sm bg-white">
              <span className="badge rounded-pill text-bg-danger mb-2">{deal.tag}</span>
              <h5>{deal.title}</h5>
              <p className="text-muted mb-3">{deal.subtitle}</p>
              {deal.storeId ? (
                <Link className="btn btn-outline-danger btn-sm" to={`/stores/${deal.storeId}`}>Shop now</Link>
              ) : (
                <button className="btn btn-outline-danger btn-sm">Shop now</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
