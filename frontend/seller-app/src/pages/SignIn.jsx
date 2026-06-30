import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

export default function SignIn() {
  const auth = getAuth()
  const [tab, setTab] = useState('login')

  // ── Login state ──────────────────────────────────────────────
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [pending, setPending] = useState(false)

  // ── Register state ───────────────────────────────────────────
  const [regForm, setRegForm] = useState({ fullName: '', email: '', password: '', phone: '', address: '' })
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [registered, setRegistered] = useState(false)

  const navigate = useNavigate()

  if (auth?.token && auth.role === 'SELLER') return <Navigate to="/list" replace />

  const submitLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    setPending(false)
    setLoginLoading(true)
    try {
      const res = await axios.post('/api/auth/login', loginForm)
      const data = res.data?.data
      if (!data?.token) throw new Error('Login failed')
      if (data.role !== 'SELLER') {
        setLoginError('This portal is for Sellers only.')
        return
      }
      setAuth(data)
      navigate('/list')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || ''
      if (msg.toLowerCase().includes('pending')) setPending(true)
      else setLoginError(msg)
    } finally {
      setLoginLoading(false)
    }
  }

  const submitRegister = async (e) => {
    e.preventDefault()
    setRegError('')
    setRegLoading(true)
    try {
      await axios.post('/api/auth/register', { ...regForm, role: 'SELLER' })
      setRegistered(true)
    } catch (err) {
      setRegError(err.response?.data?.message || err.message)
    } finally {
      setRegLoading(false)
    }
  }

  return (
    <div className="seller-auth min-vh-100 d-flex justify-content-center align-items-center px-3">
      <div className="card shadow seller-auth-card p-4" style={{ width: 440 }}>
        <h3 className="text-center mb-1">DLExpress Seller</h3>
        <p className="text-muted text-center small mb-3">
          Manage products, bundles, and orders from one dashboard.
        </p>

        {/* Tabs */}
        <ul className="nav nav-pills nav-fill mb-4 border rounded-3 p-1 bg-light">
          <li className="nav-item">
            <button
              className={`nav-link w-100 ${tab === 'login' ? 'active bg-danger text-white' : 'text-dark'}`}
              onClick={() => setTab('login')}
            >
              Login
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link w-100 ${tab === 'register' ? 'active bg-success text-white' : 'text-dark'}`}
              onClick={() => setTab('register')}
            >
              Sign Up
            </button>
          </li>
        </ul>

        {/* ── LOGIN TAB ── */}
        {tab === 'login' && (
          <>
            <div className="alert alert-info py-2 small mb-3">
              <i className="bi bi-info-circle me-1" />
              New seller accounts require <strong>admin approval</strong> before login.
            </div>
            {pending && (
              <div className="alert alert-warning py-2 small">
                <i className="bi bi-clock me-1" />
                Your account is <strong>pending admin approval</strong>. Please wait for activation.
              </div>
            )}
            {loginError && <div className="alert alert-danger py-2 small">{loginError}</div>}
            <form onSubmit={submitLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="form-control"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <button className="btn btn-danger w-100 rounded-pill" disabled={loginLoading}>
                {loginLoading ? 'Signing in…' : 'Login'}
              </button>
            </form>
            <p className="text-center small mt-3 text-muted">
              No account?{' '}
              <button className="btn btn-link btn-sm p-0" onClick={() => setTab('register')}>
                Sign up here
              </button>
            </p>
          </>
        )}

        {/* ── REGISTER TAB ── */}
        {tab === 'register' && !registered && (
          <>
            <div className="alert alert-light border small mb-3">
              <i className="bi bi-shield-check me-1 text-warning" />
              After registration, an admin will review and activate your account.
            </div>
            {regError && <div className="alert alert-danger py-2 small">{regError}</div>}
            <form onSubmit={submitRegister}>
              {[
                ['fullName', 'Full Name', 'text'],
                ['email', 'Email', 'email'],
                ['password', 'Password', 'password'],
                ['phone', 'Phone (optional)', 'text'],
                ['address', 'Business Address (optional)', 'text'],
              ].map(([k, l, t]) => (
                <div className="mb-2" key={k}>
                  <label className="form-label">{l}</label>
                  <input
                    className="form-control"
                    type={t}
                    value={regForm[k]}
                    onChange={(e) => setRegForm({ ...regForm, [k]: e.target.value })}
                    required={['fullName', 'email', 'password'].includes(k)}
                  />
                </div>
              ))}
              <button className="btn btn-success w-100 rounded-pill mt-2" disabled={regLoading}>
                {regLoading ? 'Submitting…' : 'Register as Seller'}
              </button>
            </form>
            <p className="text-center small mt-3 text-muted">
              Already have an account?{' '}
              <button className="btn btn-link btn-sm p-0" onClick={() => setTab('login')}>
                Login here
              </button>
            </p>
          </>
        )}

        {/* ── REGISTRATION SUCCESS ── */}
        {tab === 'register' && registered && (
          <div className="text-center py-3">
            <div className="display-5 mb-3">🎉</div>
            <h5 className="fw-bold">Registration Submitted!</h5>
            <p className="text-muted small mb-4">
              Your account is <strong className="text-warning">pending admin approval</strong>.
              You'll be able to log in once the admin activates your account.
            </p>
            <ul className="list-group list-group-flush text-start small mb-4">
              <li className="list-group-item border-0">
                <i className="bi bi-clock text-warning me-2" />Admin will review your application.
              </li>
              <li className="list-group-item border-0">
                <i className="bi bi-envelope text-primary me-2" />You can log in once approved.
              </li>
            </ul>
            <button
              className="btn btn-outline-danger rounded-pill"
              onClick={() => { setRegistered(false); setTab('login') }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

