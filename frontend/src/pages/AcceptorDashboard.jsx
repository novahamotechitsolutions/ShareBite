import React from 'react'
import { useAuth } from '../auth/AuthContext'

export default function AcceptorDashboard() {
  const { user, logout } = useAuth()
  return (
    <div className="page">
      <header>
        <h1>Acceptor Dashboard</h1>
        <div>
          <strong>{user?.name}</strong> ({user?.email})
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>
      <main>
        <p>Welcome, acceptor. Manage accepted donations here.</p>
      </main>
    </div>
  )
}
