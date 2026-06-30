import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { setAuth } from '../utils/auth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setPending(false)
    try {
      const res = await axios.post('/api/auth/login', form)
      const d = res.data?.data
      if (!d?.token) throw new Error('Login failed')
      if (d.role !== 'SELLER') {
        setErr('This portal is for Sellers only.')
        setLoading(false)
        return
      }
      setAuth(d)
      nav('/')
    } catch (e) {
      const msg = e.response?.data?.message || e.message || ''
      if (msg.toLowerCase().includes('pending')) {
        setPending(true)
      } else {
        setErr(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow p-4" style={{ minWidth: 360 }}>
        <h5 className="text-center mb-1">🏪 Seller Login</h5>
        <div className="alert alert-info py-2 small mb-3">
          <i className="bi bi-info-circle me-2" />
          New seller accounts require <strong>admin approval</strong> before you can log in.
        </div>

        {pending && (
          <div className="alert alert-warning py-2 small">
            <i className="bi bi-clock me-2" />
            Your seller account is <strong>pending admin approval</strong>. You'll be notified once it's activated.
          </div>
        )}
        {err && <div className="alert alert-danger py-2 small">{err}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-success w-100 rounded-pill" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
        </form>
        <p className="text-center mt-3 small">No account? <Link to="/register">Register as Seller</Link></p>
        <hr />
        <small className="text-muted text-center d-block">Customer: :5173 | Admin: :5175</small>
      </div>
    </div>
  )
}

