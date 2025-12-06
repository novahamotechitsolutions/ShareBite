import React from 'react'
import { useAuth } from '../auth/AuthContext'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="page">
      <header>
        <h1>Admin Dashboard</h1>
        <div>
          <strong>{user?.name}</strong> ({user?.email})
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <main>
        <p>Welcome, admin. Site administration tools go here.</p>
      </main>
    </div>
  )
}
