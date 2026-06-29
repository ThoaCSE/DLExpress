import React, { useEffect, useState } from 'react'

const DEALS = [
  { id: 'deal1', title: 'Fresh groceries delivered fast', subtitle: 'Explore trusted stores nearby', color: '#ffe5e5' },
  { id: 'deal2', title: 'Hot meal deals today', subtitle: 'Cooked food from local kitchens', color: '#e5f7ff' },
  { id: 'deal3', title: 'Daily essentials', subtitle: 'Stock up with one click', color: '#f3f8e8' },
]

export default function Header() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((value) => (value + 1) % DEALS.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="buyer-hero mb-4">
      <div className="buyer-hero-content p-4" style={{ background: DEALS[active].color }}>
        <div>
          <span className="eyebrow">Shop smarter</span>
          <h1>Browse top stores and order fast.</h1>
          <p className="text-muted">DLExpress brings grocery and ready-to-eat sellers together in one smooth shopper experience.</p>
        </div>
        <div className="hero-feature p-4 rounded-4 bg-white shadow-sm">
          <small className="text-uppercase fw-semibold text-secondary">Featured</small>
          <h3 className="mt-2 mb-1">{DEALS[active].title}</h3>
          <p className="text-muted mb-0">{DEALS[active].subtitle}</p>
        </div>
      </div>
    </section>
  )
}
