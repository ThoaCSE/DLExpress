import React from 'react'

const DEALS = [
  { id: 'deal1', title: 'Vegetable bundle', subtitle: 'Save €8 on fresh produce' },
  { id: 'deal2', title: 'Breakfast box', subtitle: 'Fast delivery before 9am' },
  { id: 'deal3', title: 'Snack pack', subtitle: 'Perfect for movie night' },
]

export default function DealsForToday() {
  return (
    <section className="deals-section mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1">Deals for Today</h2>
          <p className="text-muted mb-0">Curated offers from local sellers.</p>
        </div>
      </div>
      <div className="row g-3">
        {DEALS.map((deal) => (
          <div className="col-md-4" key={deal.id}>
            <div className="deal-card p-4 rounded-4 shadow-sm bg-white">
              <h5>{deal.title}</h5>
              <p className="text-muted mb-3">{deal.subtitle}</p>
              <button className="btn btn-outline-danger btn-sm">Shop now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
