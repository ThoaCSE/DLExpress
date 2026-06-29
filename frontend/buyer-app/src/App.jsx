import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getAuth } from './utils/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StoresPage from './pages/StoresPage'
import StorePage from './pages/StorePage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'

function Guard({ children }) {
  return getAuth() ? children : <Navigate to="/login"/>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Navigate to="/stores"/>}/>
        <Route path="stores" element={<StoresPage/>}/>
        <Route path="stores/:id" element={<StorePage/>}/>
        <Route path="orders" element={<Guard><OrdersPage/></Guard>}/>
        <Route path="orders/:id" element={<Guard><OrderDetailPage/></Guard>}/>
        <Route path="notifications" element={<Guard><NotificationsPage/></Guard>}/>
        <Route path="profile" element={<Guard><ProfilePage/></Guard>}/>
      </Route>
    </Routes>
  )
}
