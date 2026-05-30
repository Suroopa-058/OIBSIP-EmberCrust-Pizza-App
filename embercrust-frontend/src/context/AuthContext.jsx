import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser  = localStorage.getItem('user')

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Login
  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('token', userToken)
    localStorage.setItem('user',  JSON.stringify(userData))
  }

  // Logout
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Update user info
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const isLoggedIn  = !!user && !!token
  const isAdmin     = user?.role === 'admin'
  const isUser      = user?.role === 'user'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isLoggedIn,
      isAdmin,
      isUser,
      login,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}