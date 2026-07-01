import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

const REMEMBER_KEY = 'dlexpress_remember_email'

export default function LoginPage() {
  const auth = getAuth()
  const saved = localStorage.getItem(REMEMBER_KEY) || ''
  const [form, setForm] = useState({ email: saved, password: '' })
  const [rememberMe, setRememberMe] = useState(!!saved)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  if (auth) return <Navigate to="/explore" replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await axios.post('/api/auth/login', form)
      const d = res.data?.data
      if (!d?.token) throw new Error('Login failed')
      if (d.role !== 'BUYER') {
        setErr('Use the buyer portal for customer access.')
        setLoading(false)
        return
      }
      if (rememberMe) localStorage.setItem(REMEMBER_KEY, form.email)
      else localStorage.removeItem(REMEMBER_KEY)
      setAuth(d)
      nav('/explore')
    } catch (e) {
      setErr(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ minWidth: 360 }}>
        <h5 className="text-center mb-1">🛒 Buyer Login</h5>
        <p className="text-muted text-center small mb-3">Login to browse stores, track orders and get delivery updates.</p>

        {err && <div className="alert alert-danger py-2 small">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="customer@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label small text-secondary" htmlFor="rememberMe">
              Remember me next time
            </label>
          </div>
          <button className="btn btn-danger w-100 rounded-pill" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-3 small">New to DLExpress? <Link to="/register">Create an account</Link></p>
        <hr />
        <small className="text-muted text-center d-block">Seller: :5174 | Admin: :5175</small>
      </div>
    </div>
  )
}

