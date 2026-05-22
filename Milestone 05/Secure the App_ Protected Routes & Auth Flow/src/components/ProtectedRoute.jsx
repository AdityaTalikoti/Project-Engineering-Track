import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute guards private pages.
 * If the user is authenticated, it renders the child components.
 * Otherwise, it redirects the user to the login page.
 */
function ProtectedRoute({ children }) {
  const auth = useAuth()
  
  // Hande loading or null context state gracefully
  const isAuthenticated = auth ? auth.isAuthenticated : false

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
