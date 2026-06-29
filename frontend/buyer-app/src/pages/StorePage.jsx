import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import api from '../api/axios'
import { getAuth } from '../utils/auth'

const METHODS = [{id:'CASH',label:'💵 Cash on Delivery'},{id:'CARD',label:'💳 Card / Online'},{id:'QR',label:'📱 QR Code'}]

export default function StorePage() {
  const { id } = useParams(); const nav = useNavigate(); const auth = getAuth()
  const [foods, setFoods] = useState([]); const [cart, setCart] = useState([])
  const [method, setMethod] = useState('CASH'); const [loading, setLoading] = useState(true); const [ordering, setOrdering] = useState(false)
  const [payInfo, setPayInfo] = useState(null)

  useEffect(()=>{ axios.get(`/api/foods/store/${id}`).then(r=>setFoods(r.data?.data||[])).finally(()=>setLoading(false)) },[id])

  const add = f => setCart(prev=>{
    const ex=prev.find(i=>i.foodItemId===f.id)
    if(ex) return prev.map(i=>i.foodItemId===f.id?{...i,quantity:i.quantity+1}:i)
    return [...prev,{foodItemId:f.id,name:f.name,price:f.price,quantity:1}]
  })
  const total = cart.reduce((s,i)=>s+i.price*i.quantity,0)

  const placeOrder = async () => {
    if(!auth){nav('/login');return} if(!cart.length) return
    setOrdering(true)
    try {
      const oRes = await api.post('/buyer/orders',{storeId:id,items:cart,totalAmount:total,
        deliveryAddress:auth.address||'Demo Address',deliveryLat:48.14,deliveryLng:11.58,paymentMethod:method})
      const order = oRes.data?.data
      const pRes = await api.post('/buyer/payment/initiate',{orderId:order.id,method})
      const pData = pRes.data?.data
      if(method==='CASH'){
        setPayInfo({type:'CASH',orderId:order.id,message:pData.message})
      } else {
        // Demo mode: auto verify
        if(pData.demo){ await api.post('/buyer/payment/verify',{orderId:order.id}); nav('/orders') }
        else { setPayInfo({type:method,orderId:order.id,rzpOrderId:pData.razorpayOrderId,key:pData.key,amount:pData.amount}) }
      }
    } catch(e){ alert('Failed: '+(e.response?.data?.message||e.message)) } finally{ setOrdering(false) }
  }

  if(payInfo?.type==='CASH') return (
    <div className="text-center py-5">
      <div className="display-1">🛵</div>
      <h4 className="mt-3 text-success">Order Placed!</h4>
      <p className="text-muted">{payInfo.message}</p>
      <button className="btn btn-danger" onClick={()=>nav('/orders')}>Track Order</button>
    </div>
  )

  if(loading) return <div className="text-center py-5"><div className="spinner-border text-danger"/></div>
  return (
    <div className="row">
      <div className="col-md-8">
        <h4 className="mb-3">Menu</h4>
        <div className="row g-3">{foods.map(f=>(
          <div className="col-md-6" key={f.id}><div className="card shadow-sm">
            {f.imageUrl&&<img src={f.imageUrl} className="card-img-top" alt={f.name} style={{height:130,objectFit:'cover'}}/>}
            <div className="card-body">
              <h6>{f.name}</h6><p className="text-muted small mb-2">{f.description}</p>
              <div className="d-flex justify-content-between">
                <strong className="text-danger">Rs.{f.price}</strong>
                <button className="btn btn-danger btn-sm" onClick={()=>add(f)}>+ Add</button>
              </div>
            </div>
          </div></div>
        ))}</div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm sticky-top" style={{top:80}}>
          <div className="card-body">
            <h5>Cart</h5>
            {!cart.length ? <p className="text-muted small">Add items</p> : <>
              {cart.map(i=><div className="d-flex justify-content-between small mb-1" key={i.foodItemId}>
                <span>{i.name} ×{i.quantity}</span><span>Rs.{(i.price*i.quantity).toFixed(0)}</span>
              </div>)}
              <hr/>
              <div className="fw-bold d-flex justify-content-between mb-3">
                <span>Total</span><span className="text-danger">Rs.{total.toFixed(0)}</span>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Payment Method</label>
                {METHODS.map(m=>(
                  <div className="form-check" key={m.id}>
                    <input className="form-check-input" type="radio" name="pm" id={m.id} value={m.id} checked={method===m.id} onChange={()=>setMethod(m.id)}/>
                    <label className="form-check-label" htmlFor={m.id}>{m.label}</label>
                  </div>
                ))}
              </div>
              <button className="btn btn-danger w-100" onClick={placeOrder} disabled={ordering}>
                {ordering?'Placing...':'Place Order'}
              </button>
            </>}
          </div>
        </div>
      </div>
    </div>
  )
}
