import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

export default function OrderDetailPage() {
  const { id }=useParams(); const [order,setOrder]=useState(null); const [tracking,setTracking]=useState(null)
  useEffect(()=>{
    api.get(`/buyer/orders/${id}`).then(r=>setOrder(r.data?.data)).catch(()=>{})
    const c=new Client({ webSocketFactory:()=>new SockJS('/ws'), onConnect:()=>{ c.subscribe(`/topic/tracking/${id}`,m=>setTracking(JSON.parse(m.body))) } })
    c.activate(); return ()=>c.deactivate()
  },[id])
  if(!order) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  return (
    <div className="row justify-content-center"><div className="col-md-7">
      <h4>Order #{order.id?.substring(0,8)}</h4>
      <div className="card shadow-sm mb-3"><div className="card-body">
        <div className="d-flex justify-content-between mb-2"><strong>Status</strong><span className="badge bg-danger fs-6">{tracking?.status||order.status}</span></div>
        {(tracking?.estimatedDelivery||order.estimatedDelivery)&&<div className="d-flex justify-content-between mb-2"><strong>ETA</strong><span className="text-success">{tracking?.estimatedDelivery||order.estimatedDelivery}</span></div>}
        <div className="d-flex justify-content-between mb-2"><strong>Payment</strong><span>{order.paymentMethod} — {order.paymentStatus}</span></div>
        <div className="d-flex justify-content-between"><strong>Total</strong><span>Rs.{order.totalAmount}</span></div>
      </div></div>
      <div className="card shadow-sm"><div className="card-body">
        <h6>Items</h6>
        {order.items?.map((it,i)=><div key={i} className="d-flex justify-content-between small border-bottom py-1"><span>{it.name} ×{it.quantity}</span><span>Rs.{(it.price*it.quantity).toFixed(0)}</span></div>)}
      </div></div>
      {tracking&&<div className="card shadow-sm mt-3 border-success"><div className="card-body">
        <h6 className="text-success"><i className="bi bi-geo-alt-fill me-1"/>Live Tracking</h6>
        <p className="mb-0">Driver: {tracking.driverName||'En route'}</p>
        <p className="text-muted small mb-0">Lat: {tracking.lat?.toFixed(4)} | Lng: {tracking.lng?.toFixed(4)}</p>
      </div></div>}
    </div></div>
  )
}
