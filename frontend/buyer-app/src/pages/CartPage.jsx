import React, { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, removeCartItem, setCartItemQuantity } from '../utils/cart'

const SHIPPING_FEE = 2
const TAX_RATE = 0.1

export default function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(getCart())

  const grouped = useMemo(() => {
    return cart.reduce((acc, item) => {
      const key = item.storeId || 'unknown-store'
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})
  }, [cart])

  const marketEntries = Object.entries(grouped)

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart])
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0
  const tax = subtotal * TAX_RATE
  const total = subtotal + shipping + tax

  const updateQty = (foodItemId, nextQty) => {
    setCartItemQuantity(foodItemId, nextQty)
    setCart(getCart())
  }

  const remove = (foodItemId) => {
    removeCartItem(foodItemId)
    setCart(getCart())
  }

  return (
    <div className="cart-page container py-4">
      <h1 className="cart-heading">Shopping Cart</h1>
      {!cart.length ? (
        <div className="cart-empty">
          <i className="bi bi-cart-x cart-empty-icon" />
          <p>Your cart is empty.</p>
          <Link to="/stores" className="btn-continue">Start shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-panels">
            {marketEntries.map(([storeId, items], index) => (
              <div className="market-panel" key={storeId}>
                <div className="market-header">
                  <i className="bi bi-shop me-2" />Market {index + 1}
                </div>
                <div className="market-items">
                  {items.map((item) => (
                    <div className="cart-item" key={item.foodItemId}>
                      <img
                        src={item.imageUrl || 'https://via.placeholder.com/120x80?text=Food'}
                        alt={item.name}
                        className="cart-item-img"
                      />

                      <div className="cart-item-desc">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-category">{item.category || 'General'}</span>
                        <span className="cart-item-unit-price">€{item.price.toFixed(2)} each</span>
                      </div>

                      <div className="cart-item-qty">
                        <button className="qty-btn" onClick={() => updateQty(item.foodItemId, item.quantity - 1)}>
                          <i className="bi bi-dash" />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(item.foodItemId, item.quantity + 1)}>
                          <i className="bi bi-plus" />
                        </button>
                      </div>

                      <div className="cart-item-total">€{(item.quantity * item.price).toFixed(2)}</div>

                      <button className="cart-item-remove" onClick={() => remove(item.foodItemId)}>
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Link to="/stores" className="btn-continue">
              <i className="bi bi-arrow-left" /> Continue Shopping
            </Link>
          </div>

          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row"><span>Sub Total</span><span>€{subtotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? '—' : `€${shipping.toFixed(2)}`}</span></div>
            <div className="summary-row"><span>Tax (10%)</span><span>€{tax.toFixed(2)}</span></div>
            <hr className="summary-divider" />
            <div className="summary-row summary-total"><span>Total</span><span>€{total.toFixed(2)}</span></div>
            <button className="btn-checkout" onClick={() => navigate('/checkout')}>Check out</button>
          </div>
        </div>
      )}
    </div>
  )
}
