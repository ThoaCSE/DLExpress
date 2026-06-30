import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { getAuth } from '../utils/auth'
import { clearCart, getCart } from '../utils/cart'

const METHODS = [
  { id: 'CASH', label: 'Cash on Delivery' },
  { id: 'CARD', label: 'Card / Online' },
  { id: 'QR', label: 'QR' },
]

const MARKET_CONFIG = {
  Market_1: { shipping: 2, delivery: '20 - 30 minutes' },
  Market_2: { shipping: 3.5, delivery: '35 - 50 minutes' },
  default: { shipping: 2, delivery: '30 - 45 minutes' },
}

export default function CheckoutPage() {
  const auth = getAuth()
  const nav = useNavigate()
  const [cart] = useState(getCart())
  const [method, setMethod] = useState('CASH')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: auth?.fullName || '',
    email: auth?.email || '',
    phone: auth?.phone || '',
    address: auth?.address || '',
    city: '',
    state: '',
    zip: '',
  })

  useEffect(() => {
    if (!auth) nav('/login')
  }, [auth, nav])

  const grouped = useMemo(() => {
    return cart.reduce((acc, item) => {
      const key = item.storeId || 'unknown-store'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [cart])

  const marketTotals = useMemo(() => {
    return Object.entries(grouped).map(([storeId, items], index) => {
      const marketKey = `Market_${index + 1}`
      const config = MARKET_CONFIG[marketKey] || MARKET_CONFIG.default
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return {
        storeId,
        marketLabel: `Market ${index + 1}`,
        delivery: config.delivery,
        shipping: config.shipping,
        subtotal,
        items,
      }
    })
  }, [grouped])

  const grandSubtotal = useMemo(() => marketTotals.reduce((s, m) => s + m.subtotal, 0), [marketTotals])
  const grandShipping = useMemo(() => marketTotals.reduce((s, m) => s + (m.subtotal > 0 ? m.shipping : 0), 0), [marketTotals])
  const tax = grandSubtotal * 0.1
  const total = grandSubtotal + grandShipping + tax

  const splitName = (name) => {
    const parts = (name || '').trim().split(/\s+/)
    return {
      first: parts[0] || '',
      last: parts.slice(1).join(' '),
    }
  }

  const { first, last } = splitName(form.fullName)

  const placeAllOrders = async (e) => {
    e.preventDefault()
    if (!cart.length || !auth) return

    setSubmitting(true)
    try {
      for (const [storeId, items] of Object.entries(grouped)) {
        const payloadItems = items.map((item) => ({
          foodItemId: item.foodItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))

        const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

        const orderRes = await api.post('/buyer/orders', {
          storeId,
          items: payloadItems,
          totalAmount: subtotal,
          deliveryAddress: `${form.address}, ${form.city}, ${form.state}, ${form.zip}`,
          deliveryLat: 48.14,
          deliveryLng: 11.58,
          paymentMethod: method,
        })

        const order = orderRes.data?.data
        if (!order?.id) continue

        const paymentRes = await api.post('/buyer/payment/initiate', { orderId: order.id, method })
        const pData = paymentRes.data?.data

        if (method !== 'CASH' && pData?.demo) {
          await api.post('/buyer/payment/verify', { orderId: order.id })
        }
      }

      clearCart()
      nav('/orders')
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!auth) return null

  return (
    <div className="place-order-page container py-4">
      <h1 className="place-order-heading">Place Order</h1>

      <div className="place-order-layout">
        <div className="info-panel">
          <div className="info-panel-header">Check your Information</div>

          <form className="info-form" onSubmit={placeAllOrders}>
            <div className="form-row form-row--split">
              <div className="form-field">
                <label>First Name</label>
                <input
                  value={first}
                  onChange={(e) => setForm({ ...form, fullName: `${e.target.value} ${last}`.trim() })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input
                  value={last}
                  onChange={(e) => setForm({ ...form, fullName: `${first} ${e.target.value}`.trim() })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <label>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-row">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            </div>

            <div className="form-row form-row--triple">
              <div className="form-field">
                <label>State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div className="form-field">
                <label>Zip</label>
                <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
              </div>
            </div>

            <div className="form-row form-row--delivery">
              <label>Delivery Times</label>
              <div className="delivery-times">
                {marketTotals.map((market) => (
                  <div className="delivery-time-row" key={market.storeId}>
                    <span className="delivery-market">{market.marketLabel}</span>
                    <span className="delivery-eta">{market.delivery}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label>Payment Method</label>
              <div>
                {METHODS.map((m) => (
                  <div className="form-check" key={m.id}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="pay"
                      id={`pay-${m.id}`}
                      checked={method === m.id}
                      onChange={() => setMethod(m.id)}
                    />
                    <label className="form-check-label" htmlFor={`pay-${m.id}`}>{m.label}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <label />
              <button className="btn-continue-order" disabled={submitting || cart.length === 0}>
                {submitting ? 'Processing payment...' : 'Place Order & Pay'}
              </button>
            </div>
          </form>
        </div>

        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>

          {marketTotals.map((market) => (
            <div key={market.storeId} className="summary-market-block">
              <div className="summary-market-name">{market.marketLabel}</div>
              {market.items.map((item) => (
                <div key={item.foodItemId} className="summary-item-row">
                  <span className="summary-item-name">
                    {item.name}
                    <span className="summary-item-qty">x {item.quantity}</span>
                  </span>
                  <span>€{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div className="summary-row summary-row--sub"><span>Subtotal</span><span>€{market.subtotal.toFixed(2)}</span></div>
              <div className="summary-row summary-row--sub"><span>Shipping</span><span>€{market.shipping.toFixed(2)}</span></div>
            </div>
          ))}

          <hr className="summary-divider" />

          <div className="summary-row"><span>Sub Total</span><span>€{grandSubtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>€{grandShipping.toFixed(2)}</span></div>
          <div className="summary-row"><span>Tax (10%)</span><span>€{tax.toFixed(2)}</span></div>
          <div className="summary-row summary-total"><span>Total</span><span>€{total.toFixed(2)}</span></div>

          <div className="mock-badge">Orders are split by market/store for delivery optimization.</div>
        </div>
      </div>
    </div>
  )
}
