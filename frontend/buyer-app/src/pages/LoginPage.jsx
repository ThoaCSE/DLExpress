import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

export default function LoginPage() {
  const auth = getAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  if (auth) {
    return <Navigate to="/stores" replace />
  }

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
      setAuth(d)
      nav('/stores')
    } catch (e) {
      setErr(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="login-panel shadow-sm overflow-hidden">
        <div className="login-header text-white text-center p-4">
          <div className="mb-3 display-5">Welcome Back</div>
          <div className="small opacity-85">Login to browse stores, track orders and get delivery updates.</div>
        </div>

        <div className="login-body p-4">
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
            <button className="btn btn-danger w-100 mb-3" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
          <div className="text-center small text-muted">
            New to DLExpress? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
