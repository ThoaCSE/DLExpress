import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

export default function RegisterPage() {
  const auth = getAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '', role: 'BUYER' })
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
      const res = await axios.post('/api/auth/register', { ...form, role: 'BUYER' })
      const d = res.data?.data
      if (!d?.token) throw new Error('Failed to register')
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
          <div className="mb-3 display-6">Create your account</div>
          <div className="small opacity-85">Start ordering from stores with a friendly, fast checkout.</div>
        </div>

        <div className="login-body p-4">
          {err && <div className="alert alert-danger py-2 small">{err}</div>}
          <form onSubmit={submit}>
            {[
              ['fullName', 'Full Name', 'text'],
              ['email', 'Email', 'email'],
              ['password', 'Password', 'password'],
              ['phone', 'Phone', 'text'],
              ['address', 'Address', 'text'],
            ].map(([key, label, type]) => (
              <div className="mb-3" key={key}>
                <label className="form-label">{label}</label>
                <input
                  className="form-control"
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={['fullName', 'email', 'password'].includes(key)}
                />
              </div>
            ))}
            <button className="btn btn-danger w-100 mb-3" disabled={loading}>
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>
          <div className="text-center small text-muted">
            Already registered? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
