import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Signup from './pages/Signup'
import Login from './pages/Login'
import NgoDashboard from './pages/NgoDashboard'
import DonorDashboard from './pages/DonorDashboard'
import AcceptorDashboard from './pages/AcceptorDashboard'
import AdminDashboard from './pages/AdminDashboard'

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  switch (user.role) {
    case 'ngo':
      return <Navigate to="/dashboard/ngo" replace />
    case 'donor':
      return <Navigate to="/dashboard/donor" replace />
    case 'acceptor':
      return <Navigate to="/dashboard/acceptor" replace />
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />
    default:
      return <Navigate to="/login" replace />
  }
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/ngo" element={<NgoDashboard />} />
      <Route path="/donor-dashboard" element={<DonorDashboard />} />
      <Route path="/ngo-dashboard" element={<NgoDashboard />} />

      <Route path="/dashboard/acceptor" element={<AcceptorDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="*" element={<div>Not found</div>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
