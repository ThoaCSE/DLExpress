import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios'
import {setAuth} from '../utils/auth'
export default function LoginPage() {
  const [form,setForm]=useState({email:'',password:''}); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  const nav=useNavigate()
  const submit=async e=>{
    e.preventDefault(); setLoading(true); setErr('')
    try {
      const res=await axios.post('/api/auth/login',form); const d=res.data?.data
      if(!d?.token) throw new Error('Login failed')
      if(d.role!=='SELLER'){setErr('This portal is for Sellers only. Use the correct app.');setLoading(false);return}
      setAuth(d); nav('/')
    } catch(e){setErr(e.response?.data?.message||e.message)} finally{setLoading(false)}
  }
  return <div className="min-vh-100 d-flex align-items-center justify-content-center">
    <div className="card shadow p-4" style={{minWidth:340}}>
      <h5 className="text-center mb-1">🏪 Seller Login</h5>
      <p className="text-center text-muted small mb-3">localhost:5174</p>
      {err&&<div className="alert alert-danger py-2 small">{err}</div>}
      <form onSubmit={submit}>
        <div className="mb-3"><label className="form-label">Email</label>
          <input className="form-control" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></div>
        <div className="mb-3"><label className="form-label">Password</label>
          <input className="form-control" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></div>
        <button className="btn btn-success w-100" disabled={loading}>{loading?'...':'Login'}</button>
      </form>
      <p className="text-center mt-3 small">No account? <Link to="/register">Register as Seller</Link></p>
      <hr/><small className="text-muted">Customer: localhost:5173 | Admin: localhost:5175</small>
    </div>
  </div>
}
