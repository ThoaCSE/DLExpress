import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
const SC = {PENDING:'secondary',PAID:'info',PREPARING:'warning',OUT_FOR_DELIVERY:'primary',DELIVERED:'success',CANCELLED:'danger'}
export default function OrdersPage() {
  const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{ api.get('/buyer/orders').then(r=>setOrders(r.data?.data||[])).finally(()=>setLoading(false)) },[])
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  return <div>
    <h4 className="mb-4">My Orders</h4>
    {!orders.length?<p className="text-muted">No orders yet.</p>:orders.map(o=>(
      <div className="card shadow-sm mb-3" key={o.id}>
        <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <strong>#{o.id?.substring(0,8)}</strong>
            <div className="text-muted small">{o.items?.length} item(s) · €{o.totalAmount} · {o.paymentMethod}</div>
            {o.estimatedDelivery&&<div className="text-success small">ETA: {o.estimatedDelivery}</div>}
          </div>
          <div className="d-flex gap-2 align-items-center">
            <span className={`badge bg-${SC[o.status]||'secondary'}`}>{o.status}</span>
            <Link to={`/orders/${o.id}`} className="btn btn-outline-danger btn-sm">Track</Link>
          </div>
        </div>
      </div>
    ))}
  </div>
}
