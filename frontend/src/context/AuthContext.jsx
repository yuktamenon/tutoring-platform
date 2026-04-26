import { createContext, useContext, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('studybudee_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('studybudee_token'))
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const login = useCallback(async (credentials) => {
    setLoading(true); setError(null)
    try {
      const { data } = await loginUser(credentials)
      localStorage.setItem('studybudee_token', data.token)
      localStorage.setItem('studybudee_user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
      // Role-based redirect
      navigate(data.user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      setError(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }, [navigate])

  const register = useCallback(async (formData) => {
    setLoading(true); setError(null)
    try {
      const { data } = await registerUser(formData)
      return { success: true, data }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('studybudee_token')
    localStorage.removeItem('studybudee_user')
    setToken(null)
    setUser(null)
    navigate('/login')
  }, [navigate])

  const clearError = useCallback(() => setError(null), [])

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, clearError, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
