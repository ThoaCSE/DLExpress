import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      await axios.post('/api/auth/register', { ...form, role: 'SELLER' })
      setRegistered(true)
    } catch (e) {
      setErr(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm p-5 text-center" style={{ maxWidth: 480 }}>
          <div className="display-5 mb-3">🎉</div>
          <h4 className="fw-bold mb-2">Registration Submitted!</h4>
          <p className="text-muted mb-3">
            Thank you for registering as a seller on <strong>DLExpress</strong>. Your account is currently
            <strong className="text-warning"> pending admin approval</strong>.
          </p>
          <ul className="list-group list-group-flush text-start mb-4">
            <li className="list-group-item"><i className="bi bi-clock me-2 text-warning" />Our admin team will review your application.</li>
            <li className="list-group-item"><i className="bi bi-envelope me-2 text-primary" />You'll be able to log in once your account is approved.</li>
            <li className="list-group-item"><i className="bi bi-shield-check me-2 text-success" />This process typically takes 1–2 business days.</li>
          </ul>
          <Link to="/login" className="btn btn-success rounded-pill px-4">Back to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card shadow p-4" style={{ minWidth: 360 }}>
        <h5 className="text-center mb-1">🏪 Seller Registration</h5>
        <p className="text-muted text-center small mb-3">New accounts require admin verification before login.</p>
        {err && <div className="alert alert-danger py-2 small">{err}</div>}
        <form onSubmit={submit}>
          {[['fullName', 'Full Name'], ['email', 'Email'], ['password', 'Password'], ['phone', 'Phone (optional)'], ['address', 'Business Address (optional)']].map(([k, l]) => (
            <div className="mb-2" key={k}>
              <label className="form-label">{l}</label>
              <input
                className="form-control"
                type={k === 'email' ? 'email' : k === 'password' ? 'password' : 'text'}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                required={['fullName', 'email', 'password'].includes(k)}
              />
            </div>
          ))}
          <button className="btn btn-success w-100 mt-2 rounded-pill" disabled={loading}>
            {loading ? 'Submitting…' : 'Register as Seller'}
          </button>
        </form>
        <p className="text-center mt-3 small">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

