import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {getAuth,logout} from '../utils/auth'
export default function Navbar() {
  const auth=getAuth(); const nav=useNavigate()
  return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container-fluid px-4">
      <Link className="navbar-brand fw-bold" to="/"><i className="bi bi-shield-check me-2"/>Admin</Link>
      <div className="d-flex align-items-center gap-3 ms-auto">
        {auth&&<>
          <Link className="nav-link text-white" to="/">Dashboard</Link>
          <Link className="nav-link text-white" to="/users">Users</Link>
          <Link className="nav-link text-white" to="/stores">Stores</Link>
          <Link className="nav-link text-white" to="/orders">Orders</Link>
          <Link className="nav-link text-white" to="/deletions">Deletions</Link>
          <Link className="nav-link text-white" to="/db"><i className="bi bi-database me-1"/>DB</Link>
          <button className="btn btn-outline-light btn-sm" onClick={()=>{logout();nav('/login')}}>Logout</button>
        </>}
      </div>
    </div>
  </nav>
}
