import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getAuth } from './utils/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import StoresPage from './pages/StoresPage'
import OrdersPage from './pages/OrdersPage'
import DeletionRequestsPage from './pages/DeletionRequestsPage'
import DbViewerPage from './pages/DbViewerPage'
function Guard({children}){ return getAuth()?children:<Navigate to="/login"/> }
export default function App() {
  return <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/" element={<Layout/>}>
      <Route index element={<Guard><DashboardPage/></Guard>}/>
      <Route path="users" element={<Guard><UsersPage/></Guard>}/>
      <Route path="stores" element={<Guard><StoresPage/></Guard>}/>
      <Route path="orders" element={<Guard><OrdersPage/></Guard>}/>
      <Route path="deletions" element={<Guard><DeletionRequestsPage/></Guard>}/>
      <Route path="db" element={<Guard><DbViewerPage/></Guard>}/>
    </Route>
  </Routes>
}
