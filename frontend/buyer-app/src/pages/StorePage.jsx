import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getAuth } from '../utils/auth'
import { addCartItem, getCart, getCartItemCount, setCartItemQuantity } from '../utils/cart'

export default function StorePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const auth = getAuth()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(getCartItemCount())

  useEffect(()=>{ axios.get(`/api/foods/store/${id}`).then(r=>setFoods(r.data?.data||[])).finally(()=>setLoading(false)) },[id])

  useEffect(() => {
    const refresh = () => setCartCount(getCartItemCount())
    window.addEventListener('dlexpress-cart-changed', refresh)
    return () => window.removeEventListener('dlexpress-cart-changed', refresh)
  }, [])

  const add = (food) => {
    addCartItem({
      foodItemId: food.id,
      name: food.name,
      price: food.price,
      quantity: 1,
      storeId: id,
      imageUrl: food.imageUrl,
      description: food.description,
      category: food.category,
    })
  }

  const increase = (food) => {
    const cart = getCart()
    const existing = cart.find((item) => item.foodItemId === food.id)
    if (!existing) {
      add(food)
      return
    }
    setCartItemQuantity(food.id, (existing.quantity || 0) + 1)
  }

  const quantityOf = (foodId) => {
    const item = getCart().find((entry) => entry.foodItemId === foodId)
    return item?.quantity || 0
  }

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
                <strong className="text-danger">€{f.price}</strong>
                <button className="btn btn-danger btn-sm" onClick={() => increase(f)}>
                  + Add {quantityOf(f.id) > 0 && `(${quantityOf(f.id)})`}
                </button>
              </div>
            </div>
          </div></div>
        ))}</div>
      </div>
      <div className="col-md-4">
        <div className="card shadow-sm sticky-top" style={{top:80}}>
          <div className="card-body">
            <h5>Shopping Cart</h5>
            <p className="text-muted small mb-3">{cartCount} item(s) selected.</p>
            <button className="btn btn-danger w-100 mb-2" onClick={() => nav('/cart')} disabled={cartCount === 0}>
              Open Cart
            </button>
            <button className="btn btn-outline-danger w-100" onClick={() => nav('/checkout')} disabled={cartCount === 0 || !auth}>
              Go to Payment
            </button>
            {!auth && <p className="text-muted small mt-2 mb-0">Login required before checkout.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
