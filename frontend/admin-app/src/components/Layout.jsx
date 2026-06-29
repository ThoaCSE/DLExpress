import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
export default function Layout() {
  return <>
    <div className="app-bar">Foodie Admin Panel<span>:5175</span> → Backend<span>:8080</span> → MongoDB<span>:27017</span></div>
    <Navbar/>
    <main className="container-fluid py-4 px-4"><Outlet/></main>
  </>
}
