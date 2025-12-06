import React from 'react'
import { useAuth } from '../auth/AuthContext'

export default function DonorDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="page">
      <header>
        <h1>Donor Dashboard</h1>
        <div>
          <strong>{user?.name}</strong> ({user?.email})
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <main>
        <p>Welcome, donor. Thank you for your contributions.</p>
      </main>
    </div>
  )
}
