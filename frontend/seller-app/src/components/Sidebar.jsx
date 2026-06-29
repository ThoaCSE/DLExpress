import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = ({ sidebarVisible }) => {
  return (
    <div className={`border-end bg-white ${sidebarVisible ? '' : 'd-none'}`} id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">
        <span className="fw-bold text-danger">DLExpress Seller</span>
      </div>
      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/list">
          <i className="bi bi-card-list me-2" /> Inventory
        </Link>
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/add">
          <i className="bi bi-plus-circle me-2" /> Add Item
        </Link>
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/orders">
          <i className="bi bi-basket me-2" /> Orders
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
