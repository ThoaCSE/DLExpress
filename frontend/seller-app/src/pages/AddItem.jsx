import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { getAuth } from '../utils/auth'
import { SELLER_CATEGORIES } from '../utils/categories'

export default function AddItem() {
  const auth = getAuth()
  const [store, setStore] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', imageUrl: '' })
  const [message, setMessage] = useState('')
  const [latestItems, setLatestItems] = useState([])

  useEffect(() => {
    if (!auth?.userId) return
    api.get(`/seller/store/${auth.userId}`).then((res) => {
      setStore(res.data?.data)
      if (!form.category) setForm((prev) => ({ ...prev, category: SELLER_CATEGORIES[0] }))
    }).catch(() => {})
  }, [auth?.userId])

  const fetchLatest = async () => {
    if (!store?.id) return
    try {
      const res = await api.get(`/foods/store/${store.id}`)
      setLatestItems((res.data?.data || []).slice(-5).reverse())
    } catch (e) {
      setLatestItems([])
    }
  }

  useEffect(() => {
    fetchLatest()
  }, [store?.id])

  const submit = async (e) => {
    e.preventDefault()
    if (!store?.id) {
      setMessage('Please create or approve your store before adding items.')
      return
    }
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        storeId: store.id,
        available: true,
      }
      await api.post('/seller/foods', payload)
      setMessage('Item added successfully')
      setForm({ name: '', description: '', price: '', category: SELLER_CATEGORIES[0], imageUrl: '' })
      fetchLatest()
    } catch (err) {
      setMessage('Add item failed.')
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="card shadow-sm p-4">
          <h4 className="mb-3">Add Product</h4>
          {message && <div className="alert alert-info py-2 small">{message}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Product name</label>
              <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {SELLER_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Price (€)</label>
              <input className="form-control" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input className="form-control" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
            </div>
            <button className="btn btn-danger w-100" type="submit">Save Item</button>
          </form>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-1">Recent Items</h4>
              <small className="text-muted">Latest products in your catalog</small>
            </div>
          </div>
          <div className="list-group">
            {latestItems.length ? latestItems.map((item) => (
              <div key={item.id} className="list-group-item list-group-item-action mb-2 rounded-4 shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 12 }} />
                  ) : (
                    <div className="bg-light rounded-4 d-flex align-items-center justify-content-center" style={{ width: 80, height: 80 }}>
                      <i className="bi bi-image fs-3 text-secondary" />
                    </div>
                  )}
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{item.name}</h6>
                    <p className="mb-1 text-muted small">{item.description}</p>
                    <span className="badge bg-secondary me-2">{item.category}</span>
                    <strong className="text-danger">€{item.price}</strong>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-box-seam fs-1 d-block mb-3" /> No items available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
