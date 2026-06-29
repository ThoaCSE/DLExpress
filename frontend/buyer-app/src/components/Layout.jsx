import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
export default function Layout() {
  return <>
    <div className="app-bar">Foodie Customer App<span>:5173</span> → Backend<span>:8080</span> → MongoDB<span>:27017</span></div>
    <Navbar/>
    <main className="container py-4"><Outlet/></main>
  </>
}
