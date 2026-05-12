import { Navigate, Outlet } from 'react-router-dom'
import { AUTH_KEYS } from '../../constants/authConstants'

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const token = localStorage.getItem(AUTH_KEYS.AUTH_TOKEN)
  if (!token) return <Navigate to="/login" replace />
  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
