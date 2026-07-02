import React,{useEffect,useState} from 'react'
import api from '../api/axios'

export default function DeletionRequestsPage() {
  const [users,setUsers]=useState([]); const [loading,setLoading]=useState(true)
  const [verify,setVerify]=useState({})  // { [userId]: { flags, safeToDelete } }
  const [notes,setNotes]=useState({})

  useEffect(()=>{ api.get('/admin/deletion-requests').then(r=>setUsers(r.data?.data||[])).finally(()=>setLoading(false)) },[])

  const doVerify=async uid=>{
    const r=await api.get(`/admin/deletion-requests/${uid}/verify`)
    setVerify(v=>({...v,[uid]:r.data?.data}))
  }
  const approve=async uid=>{
    await api.post(`/admin/deletion-requests/${uid}/approve`,{note:notes[uid]||'Approved'})
    setUsers(users.map(u=>u.id===uid?{...u,deletionStatus:'APPROVED',active:false}:u))
  }
  const reject=async uid=>{
    await api.post(`/admin/deletion-requests/${uid}/reject`,{reason:notes[uid]||'Rejected — unresolved issues'})
    setUsers(users.map(u=>u.id===uid?{...u,deletionRequested:false,deletionStatus:'REJECTED'}:u))
  }

  if(loading) return <div className="text-center py-5"><div className="spinner-border text-dark"/></div>
  return <div>
    <h4 className="mb-4"><i className="bi bi-person-x me-2 text-danger"/>Account Deletion Requests</h4>
    {!users.length?<div className="alert alert-success">No pending deletion requests.</div>:
    users.filter(u=>u.deletionRequested&&u.deletionStatus==='PENDING').map(u=>(
      <div className="card shadow-sm mb-4 border-warning" key={u.id}>
        <div className="card-header bg-warning bg-opacity-25 d-flex justify-content-between align-items-center">
          <strong>{u.fullName}</strong>
          <span className={`badge ${u.role==='SELLER'?'bg-success':'bg-primary'}`}>{u.role}</span>
        </div>
        <div className="card-body">
          <p className="small"><strong>Email:</strong> {u.email}</p>
          <p className="small"><strong>Reason:</strong> {u.deletionReason||'Not specified'}</p>
          <p className="small"><strong>Requested:</strong> {u.deletionRequestedAt?new Date(u.deletionRequestedAt).toLocaleString():''}</p>

          {!verify[u.id] ? (
            <button className="btn btn-outline-dark btn-sm mb-3" onClick={()=>doVerify(u.id)}>
              <i className="bi bi-search me-1"/>Run Safety Check
            </button>
          ) : (
            <div className={`alert ${verify[u.id].safeToDelete?'alert-success':'alert-danger'} py-2 mb-3`}>
              <strong>{verify[u.id].safeToDelete?'✅ Safe to delete':'⚠️ Issues found — cannot delete'}</strong>
              {verify[u.id].flags?.length>0&&<ul className="mb-0 mt-1">
                {verify[u.id].flags.map((f,i)=><li key={i} className="small">{f}</li>)}
              </ul>}
            </div>
          )}

          <div className="mb-2">
            <label className="form-label small fw-semibold">Admin note (sent to user):</label>
            <input className="form-control form-control-sm" value={notes[u.id]||''} onChange={e=>setNotes({...notes,[u.id]:e.target.value})} placeholder="Optional note..."/>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm" onClick={()=>approve(u.id)}
              disabled={verify[u.id]&&!verify[u.id].safeToDelete}>
              <i className="bi bi-check-circle me-1"/>Approve Deletion
            </button>
            <button className="btn btn-danger btn-sm" onClick={()=>reject(u.id)}>
              <i className="bi bi-x-circle me-1"/>Reject
            </button>
          </div>
          {verify[u.id]&&!verify[u.id].safeToDelete&&<p className="text-danger small mt-2">Cannot approve while issues exist. Resolve them first or reject.</p>}
        </div>
      </div>
    ))}
  </div>
}
