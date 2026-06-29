import React,{useState} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios'
import {setAuth} from '../utils/auth'
export default function RegisterPage() {
  const [form,setForm]=useState({fullName:'',email:'',password:'',phone:'',address:''}); const [err,setErr]=useState(''); const [loading,setLoading]=useState(false)
  const nav=useNavigate()
  const submit=async e=>{
    e.preventDefault(); setLoading(true); setErr('')
    try {
      const res=await axios.post('/api/auth/register',{...form,role:'SELLER'}); const d=res.data?.data
      if(!d?.token) throw new Error('Failed'); setAuth(d); nav('/')
    } catch(e){setErr(e.response?.data?.message||e.message)} finally{setLoading(false)}
  }
  return <div className="min-vh-100 d-flex align-items-center justify-content-center">
    <div className="card shadow p-4" style={{minWidth:360}}>
      <h5 className="text-center mb-3">🏪 Seller Registration</h5>
      {err&&<div className="alert alert-danger py-2 small">{err}</div>}
      <form onSubmit={submit}>
        {[['fullName','Full Name'],['email','Email'],['password','Password'],['phone','Phone'],['address','Address']].map(([k,l])=>(
          <div className="mb-2" key={k}><label className="form-label">{l}</label>
            <input className="form-control" type={k==='email'?'email':k==='password'?'password':'text'}
              value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required={['fullName','email','password'].includes(k)}/></div>
        ))}
        <button className="btn btn-success w-100 mt-2" disabled={loading}>{loading?'...':'Register as Seller'}</button>
      </form>
      <p className="text-center mt-3 small">Already have account? <Link to="/login">Login</Link></p>
    </div>
  </div>
}
