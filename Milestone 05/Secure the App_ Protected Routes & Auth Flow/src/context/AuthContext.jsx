import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

/**
 * AuthProvider provides the authentication state to the application.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  // Login handles state and persists the session to localStorage
  const login = (userData, fakeToken) => {
    setUser(userData)
    setToken(fakeToken)
    localStorage.setItem('authToken', fakeToken)
    localStorage.setItem('authUser', JSON.stringify(userData))
    console.log('✅ User logged in:', userData.email)
  }

  // Logout clears state and removes data from storage
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    console.log('🚪 User logged out')
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
