'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  authenticated: boolean
  loading: boolean
  user: {
    username: string
    email: string
    isAdmin: boolean
  } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  loading: true,
  user: null,
  login: async () => false,
  logout: () => {},
  checkAuth: async () => false
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<AuthContextType['user']>(null)

  const checkAuth = async (): Promise<boolean> => {
    const email = localStorage.getItem('email')
    const password = localStorage.getItem('password')

    if (email && password) {
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        if (response.ok) {
          const data = await response.json()
          setUser({
            username: data.user.username,
            email: data.user.email,
            isAdmin: data.user.isAdmin || false
          })
          setAuthenticated(true)
          return true
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }
    
    setAuthenticated(false)
    setUser(null)
    return false
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('email', email)
        localStorage.setItem('password', password)
        
        setUser({
          username: data.user.username,
          email: data.user.email,
          isAdmin: data.user.isAdmin || false
        })
        setAuthenticated(true)
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
    }
    
    return false
  }

  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    setAuthenticated(false)
    setUser(null)
  }

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true)
      await checkAuth()
      setLoading(false)
    }

    initAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ authenticated, loading, user, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
} 