import React,{useEffect,useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {getAuth,logout} from '../utils/auth'
import api from '../api/axios'
export default function Navbar() {
  const auth=getAuth(); const nav=useNavigate(); const [unread,setUnread]=useState(0)
  useEffect(()=>{ if(!auth?.userId) return; api.get(`/notifications/${auth.userId}/unread-count`).then(r=>setUnread(r.data?.data?.count||0)).catch(()=>{}) },[auth?.userId])
  return <nav className="navbar navbar-expand-lg navbar-dark bg-success">
    <div className="container">
      <Link className="navbar-brand fw-bold" to="/">🏪 Foodie Seller</Link>
      <div className="d-flex align-items-center gap-3 ms-auto">
        {auth&&<><Link className="nav-link text-white" to="/">Dashboard</Link>
          <Link className="nav-link text-white" to="/orders">Orders</Link>
          <Link className="nav-link text-white position-relative" to="/notifications">
            <i className="bi bi-bell"/>
            {unread>0&&<span className="position-absolute top-0 start-100 translate-middle badge bg-warning text-dark rounded-pill" style={{fontSize:'0.6rem'}}>{unread}</span>}
          </Link>
          <Link className="nav-link text-white" to="/profile"><i className="bi bi-person-circle me-1"/>{auth.fullName}</Link>
          <button className="btn btn-outline-light btn-sm" onClick={()=>{logout();nav('/login')}}>Logout</button>
        </>}
        {!auth&&<><Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
          <Link className="btn btn-light btn-sm" to="/register">Register</Link></>}
      </div>
    </div>
  </nav>
}
