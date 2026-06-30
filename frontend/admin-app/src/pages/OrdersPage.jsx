import React,{useEffect,useState} from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs'
import api from '../api/axios'
const STATUSES=['PENDING','PAID','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED']
const PM={CASH:'💵',CARD:'💳',QR:'📱'}
export default function OrdersPage() {
  const [orders,setOrders]=useState([]); const [loading,setLoading]=useState(true)
  useEffect(()=>{ api.get('/admin/orders').then(r=>setOrders(r.data?.data||[])).finally(()=>setLoading(false)) },[])

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
    })

    client.onConnect = () => {
      client.subscribe('/topic/orders', (frame) => {
        try {
          const payload = JSON.parse(frame.body)
          const incoming = payload?.order || payload
          if (!incoming?.id) return

          setOrders((prev) => {
            const idx = prev.findIndex((order) => order.id === incoming.id)
            if (idx === -1) return [incoming, ...prev]
            const copy = [...prev]
            copy[idx] = { ...copy[idx], ...incoming }
            return copy
          })
        } catch {
          // ignore parse errors
        }
      })
    }

    client.activate()
    return () => client.deactivate()
  }, [])

  const upd=async(id,status)=>{ await api.put(`/admin/orders/${id}/status?status=${status}`); setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o)) }
  if(loading) return <div className="text-center py-5"><div className="spinner-border text-dark"/></div>
  return <div>
    <h4 className="mb-4">All Orders ({orders.length})</h4>
    {orders.map(o=><div className="card shadow-sm mb-3" key={o.id}><div className="card-body">
      <div className="d-flex justify-content-between mb-1">
        <strong>#{o.id?.substring(0,8)}</strong>
        <span>{PM[o.paymentMethod]||''} {o.paymentMethod} — <span className={`badge ${o.paymentStatus==='PAID'?'bg-success':'bg-warning text-dark'}`}>{o.paymentStatus}</span></span>
      </div>
      <div className="small text-muted mb-2">Buyer: {o.buyerId?.substring(0,10)} · €{o.totalAmount} · {o.deliveryAddress}</div>
      <div className="d-flex flex-wrap gap-1">
        {STATUSES.map(s=><button key={s} className={`btn btn-sm ${o.status===s?'btn-dark':'btn-outline-secondary'}`} onClick={()=>upd(o.id,s)} disabled={o.status===s}>{s}</button>)}
      </div>
    </div></div>)}
  </div>
}
