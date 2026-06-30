import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout() {
  const [sidebarVisible, setSidebarVisible] = useState(true)

  return (
    <>
      <div className="app-bar">DLExpress Admin Panel<span>:5175</span> → Backend<span>:8080</span> → MongoDB<span>:27017</span></div>
      <div className="d-flex" id="admin-wrapper">
        <Sidebar visible={sidebarVisible} />
        <div id="admin-page-content" className="w-100">
          <Topbar toggleSidebar={() => setSidebarVisible((v) => !v)} />
          <main className="container-fluid py-4 px-4">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
