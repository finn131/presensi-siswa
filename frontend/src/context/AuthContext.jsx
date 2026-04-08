import React, { createContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (username, password, captchaAnswer, proof) => {
    setLoading(true)
    try {
      const response = await authAPI.login(username, password, captchaAnswer, proof)
      if (response.data.success) {
        setUser(response.data.data.user)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        return { success: true, message: response.data.message }
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      localStorage.removeItem('user')
    }
  }, [])

  const checkAuth = useCallback(async () => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
