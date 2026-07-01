import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, logout } from '../utils/auth'
import api from '../api/axios'

export default function Topbar({ toggleSidebar }) {
  const auth = getAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    if (!auth?.userId) return
    const fetchUnread = () => {
      api.get(`/notifications/${auth.userId}/unread-count`)
        .then(r => setUnread(r.data?.data?.count || 0))
        .catch(() => {})
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [auth?.userId])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <button className="btn btn-dark shadow-none" onClick={toggleSidebar}>
          <i className="bi bi-list" />
        </button>

        <span className="ms-3 fw-bold text-dark">
          Admin: <span className="badge bg-danger text-uppercase ms-1">{auth?.fullName || auth?.email || 'Admin'}</span>
        </span>

        <div className="ms-auto d-flex align-items-center gap-3">
          <button
            className="btn btn-light border position-relative"
            title="Notifications"
            onClick={() => navigate('/users')}
          >
            <i className="bi bi-bell" />
            {unread > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1" /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
