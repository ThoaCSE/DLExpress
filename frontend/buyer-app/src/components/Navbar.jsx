import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAuth, logout } from '../utils/auth'
import { getCartItemCount } from '../utils/cart'

export default function Navbar() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(getCartItemCount())

  useEffect(() => {
    const refresh = () => setCartCount(getCartItemCount())
    window.addEventListener('dlexpress-cart-changed', refresh)
    window.addEventListener('dlexpress-auth-changed', refresh)
    return () => {
      window.removeEventListener('dlexpress-cart-changed', refresh)
      window.removeEventListener('dlexpress-auth-changed', refresh)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm buyer-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-danger" to="/explore">
          DLExpress
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#buyerNav"
          aria-controls="buyerNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="buyerNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/explore">
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stores">
                Stores
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/groceries">
                Groceries
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">
                Notifications
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {auth ? (
              <>
                <Link className="btn btn-outline-danger btn-sm" to="/profile">
                  {auth.fullName || auth.email}
                </Link>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-danger btn-sm" to="/login">
                  Login
                </Link>
                <Link className="btn btn-danger btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
