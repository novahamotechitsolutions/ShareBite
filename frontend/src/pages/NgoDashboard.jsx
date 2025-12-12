import React from 'react'
import { useAuth } from '../auth/AuthContext'

export default function NgoDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="page">
      <header>
        <h1>NGO Dashboard</h1>
        <div>
          <strong>{user?.name}</strong> ({user?.email})
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <main>
        <p>Welcome, NGO user. This is your dashboard.</p>
      </main>
    </div>
  )
}
