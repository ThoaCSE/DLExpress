import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, logout } from '../utils/auth'

export default function Topbar({ toggleSidebar }) {
  const auth = getAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button className="btn btn-dark shadow-none" onClick={toggleSidebar}>
          <i className="bi bi-list" />
        </button>

        <span className="ms-3 fw-bold text-dark">
          Admin: <span className="badge bg-danger text-uppercase ms-1">{auth?.fullName || auth?.email || 'Admin'}</span>
        </span>

        <div className="ms-auto">
          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1" /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
