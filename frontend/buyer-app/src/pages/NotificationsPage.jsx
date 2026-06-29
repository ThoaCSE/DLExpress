import React,{useEffect,useState} from 'react'
import api from '../api/axios'
import {getAuth} from '../utils/auth'
const ICON={ORDER_STATUS:'bi-bag-check',PAYMENT:'bi-credit-card',SYSTEM:'bi-bell',PROMOTION:'bi-tag'}
const CLR={ORDER_STATUS:'text-primary',PAYMENT:'text-success',SYSTEM:'text-warning',PROMOTION:'text-info'}
export default function NotificationsPage() {
  const auth=getAuth(); const [items,setItems]=useState([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{ if(!auth?.userId) return; api.get(`/notifications/${auth.userId}`).then(r=>setItems(r.data?.data||[])).finally(()=>setLoading(false)) },[auth?.userId])
  const markAll=()=>{ api.put(`/notifications/user/${auth.userId}/read-all`); setItems(items.map(n=>({...n,read:true}))) }
  const markOne=id=>{ api.put(`/notifications/${id}/read`); setItems(items.map(n=>n.id===id?{...n,read:true}:n)) }
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  const unread=items.filter(n=>!n.read).length
  return <div className="row justify-content-center"><div className="col-md-8">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="mb-0"><i className="bi bi-bell me-2"/>Notifications{unread>0&&<span className="badge bg-danger ms-2">{unread}</span>}</h4>
      {unread>0&&<button className="btn btn-outline-secondary btn-sm" onClick={markAll}>Mark all read</button>}
    </div>
    {!items.length?<div className="text-center py-5 text-muted"><i className="bi bi-bell-slash display-4"/><p className="mt-3">No notifications</p></div>:
    items.map(n=><div key={n.id} className={`card mb-2 shadow-sm ${!n.read?'border-danger':'border-0'}`} style={{cursor:'pointer'}} onClick={()=>!n.read&&markOne(n.id)}>
      <div className="card-body py-3">
        <div className="d-flex gap-3">
          <i className={`bi ${ICON[n.type]||'bi-bell'} fs-4 ${CLR[n.type]||'text-secondary'} mt-1`}/>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between">
              <strong className={!n.read?'text-danger':''}>{n.title}</strong>
              <small className="text-muted">{n.createdAt?new Date(n.createdAt).toLocaleString():''}</small>
            </div>
            <p className="mb-0 text-muted small mt-1">{n.message}</p>
            {!n.read&&<span className="badge bg-danger mt-1" style={{fontSize:'0.6rem'}}>NEW</span>}
          </div>
        </div>
      </div>
    </div>)}
  </div></div>
}
