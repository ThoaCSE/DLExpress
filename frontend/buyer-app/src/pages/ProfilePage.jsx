import React,{useEffect,useState} from 'react'
import api from '../api/axios'
import {getAuth,logout} from '../utils/auth'
import {useNavigate} from 'react-router-dom'

export default function ProfilePage() {
  const auth=getAuth(); const nav=useNavigate()
  const [user,setUser]=useState(null); const [reason,setReason]=useState(''); const [msg,setMsg]=useState('')
  useEffect(()=>{ api.get('/account/me').then(r=>setUser(r.data?.data)).catch(()=>{}) },[])

  const requestDeletion=async()=>{
    if(!reason.trim()){setMsg('Please provide a reason.');return}
    try {
      await api.post('/account/request-deletion',{reason})
      setMsg('Deletion request submitted. Admin will review and notify you.')
    } catch(e){ setMsg(e.response?.data?.message||'Failed') }
  }

  if(!user) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  return (
    <div className="row justify-content-center"><div className="col-md-6">
      <h4 className="mb-4"><i className="bi bi-person-circle me-2"/>My Profile</h4>
      <div className="card shadow-sm mb-4"><div className="card-body">
        <p><strong>Name:</strong> {user.fullName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone||'—'}</p>
        <p><strong>Address:</strong> {user.address||'—'}</p>
        <p className="mb-0"><strong>Member since:</strong> {user.createdAt?new Date(user.createdAt).toLocaleDateString():''}</p>
      </div></div>

      <div className="card shadow-sm border-danger"><div className="card-body">
        <h6 className="text-danger"><i className="bi bi-trash me-2"/>Request Account Deletion</h6>
        {user.deletionRequested ? (
          <div className={`alert ${user.deletionStatus==='REJECTED'?'alert-warning':'alert-info'} py-2 small`}>
            Status: <strong>{user.deletionStatus}</strong>
            {user.deletionReviewNote&&<div>Note: {user.deletionReviewNote}</div>}
          </div>
        ) : <>
          {msg&&<div className="alert alert-info py-2 small">{msg}</div>}
          <p className="text-muted small">Your account will be reviewed before deletion. Outstanding payments or disputes may block approval.</p>
          <div className="mb-3"><label className="form-label">Reason for deletion</label>
            <textarea className="form-control" rows={3} value={reason} onChange={e=>setReason(e.target.value)} placeholder="e.g. No longer using the service"/>
          </div>
          <button className="btn btn-outline-danger btn-sm" onClick={requestDeletion}>Submit Request</button>
        </>}
      </div></div>
    </div></div>
  )
}
