import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/users', icon: 'bi-people', label: 'Users' },
  { to: '/stores', icon: 'bi-shop', label: 'Stores' },
  { to: '/orders', icon: 'bi-bag-check', label: 'Orders' },
  { to: '/deletions', icon: 'bi-person-x', label: 'Deletion Requests' },
  { to: '/db', icon: 'bi-database', label: 'Database Viewer' },
]

export default function Sidebar({ visible }) {
  const location = useLocation()

  return (
    <div className={`border-end bg-white ${visible ? '' : 'd-none'}`} id="admin-sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <span className="fw-bold text-danger">DLExpress Admin</span>
      </div>
      <div className="list-group list-group-flush">
        {LINKS.map((item) => {
          const isActive = item.to === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.to)
          return (
            <Link
              key={item.to}
              className={`list-group-item list-group-item-action p-3 ${isActive ? 'active' : 'list-group-item-light'}`}
              to={item.to}
            >
              <i className={`bi ${item.icon} me-2`} />
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
