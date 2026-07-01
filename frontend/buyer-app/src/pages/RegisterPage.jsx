import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth, setAuth } from '../utils/auth'

const SELLER_APP_URL = 'http://localhost:5174'

export default function RegisterPage() {
  const auth = getAuth()
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '', address: '', role: 'BUYER',
  })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  if (auth) return <Navigate to="/stores" replace />

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr('')

    // Provider: redirect to seller app registration with pre-filled data
    if (form.role === 'SELLER') {
      const params = new URLSearchParams({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
      })
      window.location.href = `${SELLER_APP_URL}/register?${params.toString()}`
      return
    }

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

  const fields = [
    { key: 'fullName',  label: 'Full Name',     type: 'text',     placeholder: 'John Doe' },
    { key: 'email',     label: 'Email address', type: 'email',    placeholder: 'name@example.com' },
    { key: 'password',  label: 'Password',      type: 'password', placeholder: '••••••••' },
    { key: 'phone',     label: 'Phone',         type: 'text',     placeholder: '+49 123 456789' },
    { key: 'address',   label: 'Address',       type: 'text',     placeholder: '123 Main St' },
  ]

  return (
    <div className="auth-container py-5">
      <div className="row w-100">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-2">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-5 fw-light fs-5 text-uppercase text-secondary">
                Sign Up
              </h5>

              {err && <div className="alert alert-danger py-2 small">{err}</div>}

              <form onSubmit={submit}>
                {/* Role selector */}
                <div className="mb-4">
                  <label className="form-label text-muted small fw-semibold text-uppercase">I am a…</label>
                  <div className="d-flex gap-3">
                    {[{ value: 'BUYER', label: '🛒 Customer' }, { value: 'SELLER', label: '🏪 Provider' }].map(({ value, label }) => (
                      <div
                        key={value}
                        className={`flex-fill text-center py-2 px-3 rounded-2 border ${form.role === value ? 'border-primary bg-primary bg-opacity-10 fw-semibold' : 'border-secondary-subtle text-muted'}`}
                        style={{ cursor: 'pointer', transition: 'all .15s' }}
                        onClick={() => setForm({ ...form, role: value })}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  {form.role === 'SELLER' && (
                    <div className="alert alert-info py-2 small mt-2 mb-0">
                      You'll be redirected to the Seller portal to complete registration. Your info will be pre-filled and pending admin approval.
                    </div>
                  )}
                </div>

                {fields.map(({ key, label, type, placeholder }) => (
                  <div className="form-floating mb-3" key={key}>
                    <input
                      type={type}
                      className="form-control rounded-2"
                      id={`reg-${key}`}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required={['fullName', 'email', 'password'].includes(key)}
                    />
                    <label htmlFor={`reg-${key}`} className="text-muted">{label}</label>
                  </div>
                ))}

                <div className="d-grid mb-3">
                  <button
                    className="btn text-uppercase fw-bold py-2 rounded-pill shadow-sm"
                    type="submit"
                    disabled={loading}
                    style={{ letterSpacing: '1px', backgroundColor: '#99D9F2', border: 'none', color: '#1f2937' }}
                  >
                    {loading ? 'Please wait…' : form.role === 'SELLER' ? 'Continue to Seller Portal →' : 'Sign Up'}
                  </button>
                </div>

                <div className="small text-secondary mb-3 d-flex gap-2">
                  Already have an account? <Link to="/login">Sign in</Link>
                </div>

                <hr className="my-4 text-muted opacity-25" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
