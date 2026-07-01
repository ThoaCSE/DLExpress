import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getAuth, logout } from './utils/auth'
import Sidebar from './components/Sidebar'
import Menubar from './components/Menubar'
import SignIn from './pages/SignIn'
import RegisterPage from './pages/RegisterPage'
import AddItem from './pages/AddItem'
import ListItem from './pages/ListItem'
import Orders from './pages/Orders'

function Guard({ children }) {
  const auth = getAuth()
  return auth?.token && auth.role === 'SELLER' ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const auth = getAuth()
  return auth?.token && auth.role === 'SELLER' ? <Navigate to="/list" replace /> : children
}

function SellerShell() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const auth = getAuth()

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible} />
      <div id="page-content-wrapper" className="w-100">
        <Menubar
          toggleSidebar={() => setSidebarVisible((visible) => !visible)}
          shopId={auth?.fullName || auth?.email || auth?.userId}
          onLogout={logout}
        />
        <div className="container-fluid px-4 py-4">
          <Routes>
            <Route path="/add" element={<AddItem />} />
            <Route path="/list" element={<ListItem />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route path="*" element={<Navigate to="/list" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/*" element={<Guard><SellerShell /></Guard>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
