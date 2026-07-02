import React, { useEffect, useState } from 'react'
import api from '../api/axios'

export default function StoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    setError('')
    api.get('/admin/stores')
      .then((r) => {
        const all = r.data?.data || []
        // Filter out blank/empty stores (no name)
        setStores(all.filter((s) => s.name && s.name.trim()))
      })
      .catch((e) => setError(e.response?.data?.message || 'Failed to load stores'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const approve = async (id) => {
    await api.put(`/admin/stores/${id}/approve`)
    setStores((prev) => prev.map((s) => s.id === id ? { ...s, approved: true } : s))
  }

  const reject = async (id) => {
    await api.put(`/admin/stores/${id}/reject`)
    setStores((prev) => prev.map((s) => s.id === id ? { ...s, approved: false } : s))
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-dark" /></div>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Stores ({stores.length})</h4>
        <button className="btn btn-outline-dark btn-sm" onClick={load}><i className="bi bi-arrow-clockwise me-1" />Refresh</button>
      </div>

      {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}

      {stores.length === 0 && !error ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-shop display-5 d-block mb-3" />
          No stores found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr><th>Name</th><th>Category</th><th>Description</th><th>Owner ID</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.category || <span className="text-muted">—</span>}</td>
                  <td><small className="text-muted">{s.description ? s.description.substring(0, 40) + (s.description.length > 40 ? '…' : '') : '—'}</small></td>
                  <td><small className="text-muted font-monospace">{s.ownerId?.substring(0, 12)}…</small></td>
                  <td><span className={`badge ${s.approved ? 'bg-success' : 'bg-warning text-dark'}`}>{s.approved ? 'Live' : 'Pending'}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      {!s.approved && <button className="btn btn-success btn-sm" onClick={() => approve(s.id)}><i className="bi bi-check-circle me-1" />Approve</button>}
                      {s.approved && <button className="btn btn-outline-danger btn-sm" onClick={() => reject(s.id)}><i className="bi bi-x-circle me-1" />Revoke</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

