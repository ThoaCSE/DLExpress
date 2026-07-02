import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth, logout } from '../utils/auth'
import api from '../api/axios'

export default function Topbar({ toggleSidebar }) {
  const auth = getAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const fetchNotifications = async () => {
    if (!auth?.userId) return
    try {
      const r = await api.get(`/notifications/${auth.userId}`)
      setNotifications(r.data?.data || [])
    } catch (_) { /* silent */ }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleNotifClick = async (n) => {
    if (!n.read) {
      await api.put(`/notifications/${n.id}/read`).catch(() => {})
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))
    }
    setShowDropdown(false)
    if (n.type === 'USER_REGISTRATION') navigate('/users')
  }

  const markAllRead = async () => {
    await api.put(`/notifications/user/${auth.userId}/read-all`).catch(() => {})
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

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

        <div className="ms-auto d-flex align-items-center gap-2">
          {/* Notification Bell */}
          <div className="position-relative" ref={dropdownRef}>
            <button
              className="btn btn-outline-secondary btn-sm position-relative"
              onClick={() => setShowDropdown((v) => !v)}
              title="Notifications"
            >
              <i className="bi bi-bell" />
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem', minWidth: 16, padding: '2px 4px' }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showDropdown && (
              <div
                className="dropdown-menu show shadow"
                style={{ right: 0, left: 'auto', minWidth: 340, maxHeight: 420, overflowY: 'auto', position: 'absolute', top: '110%', zIndex: 1050 }}
              >
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom bg-light">
                  <span className="fw-bold small">Notifications</span>
                  {unreadCount > 0 && (
                    <button className="btn btn-link btn-sm p-0 text-muted" style={{ fontSize: '0.75rem' }} onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-muted small"><i className="bi bi-bell-slash d-block mb-1" />No notifications</div>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <div
                      key={n.id}
                      className={`px-3 py-2 border-bottom ${!n.read ? 'bg-warning bg-opacity-10' : ''}`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotifClick(n)}
                    >
                      <div className="d-flex align-items-start gap-2">
                        <i className={`bi ${
                          n.type === 'USER_REGISTRATION' ? 'bi-person-plus-fill text-warning' : 'bi-bell-fill text-secondary'
                        } mt-1 flex-shrink-0`} />
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className={`small ${!n.read ? 'fw-semibold' : 'text-muted'}`}>{n.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>{n.message}</div>
                          <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                          </div>
                        </div>
                        {!n.read && <span className="badge bg-warning rounded-pill ms-1" style={{ width: 8, height: 8, padding: 0, flexShrink: 0, alignSelf: 'center' }} />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1" /> Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
