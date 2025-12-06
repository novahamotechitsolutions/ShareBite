import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'fd_auth_user'

function fakeDelay(ms = 300) {
  return new Promise((res) => setTimeout(res, ms))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) setUser(JSON.parse(raw))
  }, [])

  async function register({ name, email, password, role }) {
    await fakeDelay()
    const users = JSON.parse(localStorage.getItem('fd_users') || '[]')
    if (users.find((u) => u.email === email)) {
      throw new Error('Email already registered')
    }
    const newUser = { id: Date.now(), name, email, password, role }
    users.push(newUser)
    localStorage.setItem('fd_users', JSON.stringify(users))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  async function login({ email, password }) {
    await fakeDelay()
    const users = JSON.parse(localStorage.getItem('fd_users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
    return found
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
