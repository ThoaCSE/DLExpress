import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function DashboardPage() {
  const [pendingCount, setPendingCount] = useState(null)
  const [buyerCount, setBuyerCount] = useState(null)
  const [error, setError] = useState(null)

  const fetchStats = () => {
    setError(null)
    api.get('/admin/users')
      .then((r) => {
        const users = r.data?.data || []
        setPendingCount(users.filter((u) => u.role === 'SELLER' && !u.active).length)
        setBuyerCount(users.filter((u) => u.role === 'BUYER').length)
      })
      .catch((e) => {
        const status = e.response?.status
        if (status === 403) {
          setError('Access denied (403) — session may have expired. Please log out and log back in.')
        } else if (e.code === 'ERR_NETWORK' || !e.response) {
          setError('Cannot connect to backend (port 8080). Make sure the Spring Boot app is running.')
        } else {
          setError(`Error ${status || ''}: ${e.response?.data?.message || e.message}`)
        }
        setPendingCount(0)
        setBuyerCount(0)
      })
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const cards = [
    { to: '/users', icon: 'bi-hourglass-split', label: 'Seller Approvals', color: 'warning', desc: 'Review and approve new seller registrations', badge: pendingCount },
    { to: '/users?tab=all', icon: 'bi-people', label: 'All Users', color: 'primary', desc: `Manage all buyer & seller accounts${buyerCount != null ? ` (${buyerCount} buyers)` : ''}` },
    { to: '/stores', icon: 'bi-shop', label: 'Stores', color: 'success', desc: 'View store listings' },
    { to: '/orders', icon: 'bi-bag-check', label: 'Orders', color: 'dark', desc: 'Monitor all orders in the system' },
    { to: '/deletions', icon: 'bi-person-x', label: 'Deletion Requests', color: 'danger', desc: 'Review & approve account deletions' },
    { to: '/db', icon: 'bi-database', label: 'Database Viewer', color: 'secondary', desc: 'Browse all collections in MongoDB' },
  ]

  return (
    <div>
      <h4 className="mb-1"><i className="bi bi-shield-check me-2 text-danger" />Admin Dashboard</h4>
      <p className="text-muted mb-4">DLExpress — System Administrator</p>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <i className="bi bi-exclamation-triangle-fill" />
          <div className="flex-grow-1 small">{error}</div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchStats}>Retry</button>
        </div>
      )}

      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-md-4" key={c.label}>
            <div className="card shadow-sm h-100 text-center p-3 position-relative">
              {c.badge != null && c.badge > 0 && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-2">{c.badge}</span>
              )}
              <i className={`bi ${c.icon} display-5 text-${c.color}`} />
              <h5 className="mt-2">{c.label}</h5>
              <p className="text-muted small">{c.desc}</p>
              <Link to={c.to} className={`btn btn-${c.color} btn-sm mt-auto`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

