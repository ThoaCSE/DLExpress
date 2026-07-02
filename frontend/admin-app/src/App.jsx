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

function Guard({ children }) {
  const auth = getAuth()
  if (!auth?.token) return <Navigate to="/login" replace />
  if (auth.role !== 'ADMIN') return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const auth = getAuth()
  return auth?.token && auth.role === 'ADMIN' ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/" element={<Guard><Layout /></Guard>}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="deletions" element={<DeletionRequestsPage />} />
        <Route path="db" element={<DbViewerPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
