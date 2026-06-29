import React, { useEffect, useState } from 'react'

const DEALS = [
  {
    id: 'deal1',
    title: 'Family Bundle Week',
    subtitle: 'Save up to 30% on rice, vegetables, milk and eggs',
    cta: 'Use code FAMILY30',
    color: 'linear-gradient(135deg, #fff0ea 0%, #ffe3e8 100%)',
  },
  {
    id: 'deal2',
    title: 'Late Night Cravings',
    subtitle: 'Exclusive snacks and drinks combo after 8 PM',
    cta: 'Free delivery for orders above €20',
    color: 'linear-gradient(135deg, #ecf8ff 0%, #deebff 100%)',
  },
  {
    id: 'deal3',
    title: 'Breakfast Boost Pack',
    subtitle: 'Fresh bakery + coffee + fruit at a special combo price',
    cta: 'Delivery in 20-30 mins from nearby stores',
    color: 'linear-gradient(135deg, #f4f9eb 0%, #e8f5d9 100%)',
  },
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
          <span className="eyebrow">Smart Shopping Experience</span>
          <h1>Find great stores, grab bundles, and order in minutes.</h1>
          <p className="text-muted">DLExpress brings groceries and ready-to-eat items into one customer-friendly app with live offers.</p>
          <div className="hero-ad-badge mt-3">{DEALS[active].cta}</div>
        </div>
        <div className="hero-feature p-4 rounded-4 bg-white shadow-sm">
          <small className="text-uppercase fw-semibold text-secondary">Sponsored Offer</small>
          <h3 className="mt-2 mb-1">{DEALS[active].title}</h3>
          <p className="text-muted mb-0">{DEALS[active].subtitle}</p>
        </div>
      </div>
    </section>
  )
}
