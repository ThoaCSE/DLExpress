import React, { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('pending') // 'pending' | 'all'
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchUsers = useCallback(() => {
    setLoading(true)
    setError(null)
    api.get('/admin/users')
      .then((r) => {
        const data = r.data?.data
        if (!Array.isArray(data)) {
          setError('Unexpected response from server. Check backend connection.')
          setUsers([])
        } else {
          setUsers(data)
          setLastUpdated(new Date())
        }
      })
      .catch((e) => {
        const status = e.response?.status
        if (status === 403) {
          setError('Access denied (403). Your session may have expired — please log out and log in again.')
        } else if (status === 401) {
          setError('Unauthorized (401). Please log in again.')
        } else if (e.code === 'ERR_NETWORK' || !e.response) {
          setError('Cannot reach backend server. Make sure the Spring Boot app is running on port 8080.')
        } else {
          setError(`Server error (${status || 'unknown'}): ${e.response?.data?.message || e.message}`)
        }
        setUsers([])
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchUsers()
    // Auto-poll every 30 seconds to detect new pending sellers/buyers
    const interval = setInterval(fetchUsers, 30000)
    return () => clearInterval(interval)
  }, [fetchUsers])

  const toggle = async (u) => {
    try {
      await api.put(`/admin/users/${u.id}/active?active=${!u.active}`)
      setUsers(prev => prev.map((x) => x.id === u.id ? { ...x, active: !x.active } : x))
    } catch (e) {
      alert('Failed to update user: ' + (e.response?.data?.message || e.message))
    }
  }

  const hardDelete = async (u) => {
    const ok = window.confirm(`Permanently delete ${u.fullName} and all related data?`)
    if (!ok) return
    try {
      await api.delete(`/admin/users/${u.id}/hard`)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
    } catch (e) {
      alert('Failed to delete user: ' + (e.response?.data?.message || e.message))
    }
  }

  const pendingSellers = users.filter((u) => u.role === 'SELLER' && !u.active)
  const allUsers = users

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-1">
        <h4 className="mb-0">User Management</h4>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchUsers} disabled={loading}>
          <i className="bi bi-arrow-clockwise me-1" />
          {loading ? 'Loading…' : 'Refresh'}
        </button>
      </div>
      <p className="text-muted mb-2">
        {users.length} total users · {pendingSellers.length} pending seller{pendingSellers.length !== 1 ? 's' : ''}
        {lastUpdated && <span className="ms-2 small">· Updated {lastUpdated.toLocaleTimeString()}</span>}
      </p>

      {/* Error Banner */}
      {error && (
        <div className="alert alert-danger d-flex align-items-start gap-2 mb-3" role="alert">
          <i className="bi bi-exclamation-triangle-fill mt-1" />
          <div className="flex-grow-1">
            <strong>Failed to load users</strong>
            <div className="small mt-1">{error}</div>
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={fetchUsers}>Retry</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-dark" />
          <p className="text-muted mt-2 small">Fetching users from database…</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'pending' ? 'active' : ''}`}
                onClick={() => setTab('pending')}
              >
                <i className="bi bi-hourglass-split me-1 text-warning" />
                Pending Sellers
                {pendingSellers.length > 0 && (
                  <span className="badge bg-warning text-dark ms-2">{pendingSellers.length}</span>
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${tab === 'all' ? 'active' : ''}`}
                onClick={() => setTab('all')}
              >
                <i className="bi bi-people me-1" />
                All Users ({users.length})
              </button>
            </li>
          </ul>

          {/* PENDING SELLERS TAB */}
          {tab === 'pending' && (
            pendingSellers.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-check-circle display-5 text-success d-block mb-3" />
                No pending seller registrations.
              </div>
            ) : (
              <div className="row g-3">
                {pendingSellers.map((u) => (
                  <div className="col-md-6 col-lg-4" key={u.id}>
                    <div className="card shadow-sm h-100 border-warning border-2">
                      <div className="card-body">
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <div
                            className="rounded-circle bg-warning d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ width: 48, height: 48, fontSize: 20 }}
                          >
                            {(u.fullName || u.email || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <h6 className="mb-0 fw-bold">{u.fullName || '(no name)'}</h6>
                            <small className="text-muted">{u.email}</small>
                          </div>
                        </div>
                        {u.phone && <p className="small text-muted mb-1"><i className="bi bi-telephone me-1" />{u.phone}</p>}
                        {u.address && <p className="small text-muted mb-2"><i className="bi bi-geo-alt me-1" />{u.address}</p>}
                        <small className="text-muted">
                          Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                        </small>
                      </div>
                      <div className="card-footer bg-transparent d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm flex-grow-1 rounded-pill"
                          onClick={() => toggle(u)}
                        >
                          <i className="bi bi-check-circle me-1" />Approve
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill"
                          onClick={() => hardDelete(u)}
                        >
                          <i className="bi bi-x-circle me-1" />Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* ALL USERS TAB */}
          {tab === 'all' && (
            allUsers.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-people display-5 d-block mb-3" />
                No users found in the database.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Registered</th><th>Last Login</th><th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="fw-semibold">{u.fullName || '—'}</td>
                        <td><small>{u.email}</small></td>
                        <td>
                          <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : u.role === 'SELLER' ? 'bg-success' : 'bg-primary'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${u.active ? 'bg-success' : 'bg-secondary'}`}>
                            {u.active ? 'Active' : u.role === 'SELLER' ? 'Pending' : 'Locked'}
                          </span>
                          {u.deletionRequested && (
                            <span className="badge bg-warning text-dark ms-1">Del Pending</span>
                          )}
                        </td>
                        <td><small className="text-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</small></td>
                        <td><small className="text-muted">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</small></td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <div className="d-flex gap-2">
                              <button
                                className={`btn btn-sm ${u.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                onClick={() => toggle(u)}
                              >
                                {u.active ? 'Lock' : 'Approve'}
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => hardDelete(u)}>Delete</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

