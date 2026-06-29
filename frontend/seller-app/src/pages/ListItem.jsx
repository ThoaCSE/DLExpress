import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { getAuth } from '../utils/auth'
import { SELLER_CATEGORIES } from '../utils/categories'

export default function ListItem() {
  const auth = getAuth()
  const [store, setStore] = useState(null)
  const [items, setItems] = useState([])
  const [filterCategory, setFilterCategory] = useState('All')
  const [editItem, setEditItem] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!auth?.userId) return
    api.get(`/seller/store/${auth.userId}`).then((res) => setStore(res.data?.data)).catch(() => {})
  }, [auth?.userId])

  const fetchItems = async () => {
    if (!store?.id) return
    const res = await api.get(`/foods/store/${store.id}`)
    setItems(res.data?.data || [])
  }

  useEffect(() => {
    fetchItems()
  }, [store?.id])

  const filtered = items.filter((item) => filterCategory === 'All' || item.category === filterCategory)

  const saveEdit = async () => {
    if (!editItem) return
    try {
      await api.put(`/seller/foods/${editItem.id}`, editItem)
      setEditItem(null)
      setMessage('Updated successfully')
      fetchItems()
    } catch (e) {
      setMessage('Update failed.')
    }
  }

  const deleteItem = async (id) => {
    await api.delete(`/seller/foods/${id}`)
    setMessage('Item removed')
    fetchItems()
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="mb-1">Inventory</h4>
          <p className="text-muted mb-0">Manage products available in your store.</p>
        </div>
        <div className="btn-group">
          <button className={`btn btn-sm ${filterCategory === 'All' ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => setFilterCategory('All')}>
            All
          </button>
          {SELLER_CATEGORIES.slice(0, 5).map((category) => (
            <button key={category} className={`btn btn-sm ${filterCategory === category ? 'btn-danger' : 'btn-outline-secondary'}`} onClick={() => setFilterCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="alert alert-info py-2 small">{message}</div>}

      <div className="table-responsive bg-white rounded-4 shadow-sm overflow-hidden">
        <table className="table table-hover mb-0 align-middle">
          <thead className="table-light">
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Price</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? filtered.map((item) => (
              <tr key={item.id || item.name}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="rounded" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                    ) : (
                      <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ width: 60, height: 60 }}>
                        <i className="bi bi-image text-secondary fs-4" />
                      </div>
                    )}
                    <div>
                      <strong>{item.name}</strong>
                      <div className="text-muted small">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td>{item.category}</td>
                <td>€{item.price}</td>
                <td className="text-end">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditItem(item)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editItem && (
        <div className="card shadow-sm rounded-4 mt-4 p-4">
          <h5 className="mb-3">Edit Item</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input className="form-control" value={editItem.name} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input className="form-control" type="number" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select className="form-select" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}>
                {SELLER_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Image URL</label>
              <input className="form-control" value={editItem.imageUrl} onChange={(e) => setEditItem({ ...editItem, imageUrl: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows="3" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-outline-secondary" onClick={() => setEditItem(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={saveEdit}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
