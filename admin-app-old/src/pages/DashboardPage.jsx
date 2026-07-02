import React from 'react'
import {Link} from 'react-router-dom'
export default function DashboardPage() {
  const cards=[
    {to:'/users',icon:'bi-people',label:'Users',color:'primary',desc:'Manage buyer & seller accounts'},
    {to:'/stores',icon:'bi-shop',label:'Stores',color:'success',desc:'Approve/reject store registrations'},
    {to:'/orders',icon:'bi-bag-check',label:'Orders',color:'warning',desc:'Monitor all orders in the system'},
    {to:'/deletions',icon:'bi-person-x',label:'Deletion Requests',color:'danger',desc:'Review & approve account deletions'},
    {to:'/db',icon:'bi-database',label:'Database Viewer',color:'dark',desc:'Browse all collections in MongoDB'},
  ]
  return <div>
    <h4 className="mb-1"><i className="bi bi-shield-check me-2 text-danger"/>Admin Dashboard</h4>
    <p className="text-muted mb-4">Foodie v5.2 — System Administrator</p>
    <div className="row g-3">
      {cards.map(c=><div className="col-md-4" key={c.to}>
        <div className="card shadow-sm h-100 text-center p-3">
          <i className={`bi ${c.icon} display-5 text-${c.color}`}/>
          <h5 className="mt-2">{c.label}</h5>
          <p className="text-muted small">{c.desc}</p>
          <Link to={c.to} className={`btn btn-${c.color} btn-sm mt-auto`}>Open</Link>
        </div>
      </div>)}
    </div>
  </div>
}
