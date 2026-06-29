import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getAuth, logout } from './utils/auth'
import Sidebar from './components/Sidebar'
import Menubar from './components/Menubar'
import SignIn from './pages/SignIn'
import AddItem from './pages/AddItem'
import ListItem from './pages/ListItem'
import Orders from './pages/Orders'

function Guard({ children }) {
  const auth = getAuth()
  return auth?.token && auth.role === 'SELLER' ? children : <Navigate to="/login" />
}

export default function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const auth = getAuth()

  if (!auth?.token || auth.role !== 'SELLER') {
    return <SignIn />
  }

  return (
    <div className="d-flex" id="wrapper">
      <Sidebar sidebarVisible={sidebarVisible} />
      <div id="page-content-wrapper" className="w-100">
        <Menubar
          toggleSidebar={() => setSidebarVisible((visible) => !visible)}
          shopId={auth.fullName || auth.email || auth.userId}
          onLogout={logout}
        />
        <div className="container-fluid px-4 py-4">
          <Routes>
            <Route path="/add" element={<Guard><AddItem /></Guard>} />
            <Route path="/list" element={<Guard><ListItem /></Guard>} />
            <Route path="/orders" element={<Guard><Orders /></Guard>} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/" element={<Navigate to="/list" />} />
            <Route path="*" element={<Navigate to="/list" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
