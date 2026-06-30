import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getAuth } from './utils/auth'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StoresPage from './pages/StoresPage'
import StorePage from './pages/StorePage'
import GroceriesPage from './pages/GroceriesPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import NotificationsPage from './pages/NotificationsPage'
import ProfilePage from './pages/ProfilePage'
import ExplorePage from './pages/ExplorePage'
import FoodDetailsPage from './pages/FoodDetailsPage'

function Guard({ children }) {
  return getAuth() ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  return getAuth() ? <Navigate to="/stores" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<Guard><Layout /></Guard>}>
        <Route index element={<Navigate to="/explore" replace />} />
        <Route path="stores" element={<StoresPage />} />
        <Route path="stores/:id" element={<StorePage />} />
        <Route path="groceries" element={<GroceriesPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="food/:id" element={<FoodDetailsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
