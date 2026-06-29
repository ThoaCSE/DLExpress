import React, { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS_OPTIONS = ['PENDING', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
const STATUS_CLASS = {
  PENDING: 'bg-warning text-dark',
  PREPARING: 'bg-info text-dark',
  READY: 'bg-primary text-white',
  OUT_FOR_DELIVERY: 'bg-secondary text-white',
  DELIVERED: 'bg-success',
  CANCELLED: 'bg-danger',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const res = await api.get('/seller/orders')
      setOrders(res.data?.data || [])
    } catch (e) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/seller/orders/${orderId}/status?status=${status}`)
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status } : order)))
    } catch (e) {
      // ignore
    }
  }

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-danger" /></div>
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Orders</h4>
          <p className="text-muted mb-0">Track and update order progress in real time.</p>
        </div>
      </div>

      {!orders.length ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-cart fs-1 d-block mb-3" /> No orders yet.
        </div>
      ) : (
        <div className="table-responsive bg-white rounded-4 shadow-sm overflow-hidden">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="text-end">Update</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>#{order.id?.substring(0, 8)}</strong>
                    <div className="text-muted small">{order.paymentMethod}</div>
                  </td>
                  <td>
                    <div>{order.customerName || order.name || 'Customer'}</div>
                    <div className="text-muted small">{order.deliveryAddress || order.address}</div>
                  </td>
                  <td>€{order.totalAmount}</td>
                  <td>
                    <span className={`badge ${STATUS_CLASS[order.status] || 'bg-secondary'}`}>{order.status}</span>
                  </td>
                  <td className="text-end">
                    <select className="form-select form-select-sm w-auto d-inline-block" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
