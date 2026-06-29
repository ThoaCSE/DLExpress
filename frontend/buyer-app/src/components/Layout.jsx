import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="buyer-shell">
      <Navbar />
      <main className="buyer-main container py-4">
        <Outlet />
      </main>
    </div>
  )
}
