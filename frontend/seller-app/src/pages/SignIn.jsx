import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

export default function SignIn() {
  const auth = getAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (auth?.token && auth.role === 'SELLER') {
    return <Navigate to="/list" replace />
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('/api/auth/login', form)
      const data = res.data?.data
      if (!data?.token) throw new Error('Login failed')
      if (data.role !== 'SELLER') {
        setError('This portal is for Sellers only. Use the correct app.')
        setLoading(false)
        return
      }
      setAuth(data)
      navigate('/list')
    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="seller-auth min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div className="card shadow seller-auth-card p-4" style={{ width: 410 }}>
        <h3 className="text-center mb-2">DLExpress Seller Login</h3>
        <p className="text-muted text-center small mb-4">Manage products, bundles, and orders from one dashboard.</p>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
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
              required
            />
          </div>
          <button className="btn btn-danger w-100 rounded-pill" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
