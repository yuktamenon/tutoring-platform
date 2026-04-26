import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export function RoleRoute({ role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (user.role !== role) {
    return (
      <Navigate
        to={user.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard'}
        replace
      />
    )
  }

  return <Outlet />
}
