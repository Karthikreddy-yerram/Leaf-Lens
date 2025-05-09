"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import axios from "axios"

type User = {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  serverAvailable: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  serverAvailable: true
})

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [serverAvailable, setServerAvailable] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const protectedRoutes = ['/dashboard', '/feedback', '/identify']
  
  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const checkRouteProtection = async () => {
      if (isLoading) return
      
      const isProtectedRoute = protectedRoutes.some(route => 
        pathname === route || pathname?.startsWith(`${route}/`)
      )
      
      if (isProtectedRoute && !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        })
        
        sessionStorage.setItem('redirectAfterLogin', pathname || '')
        
        router.push('/login')
      }
    }
    
    checkRouteProtection()
  }, [pathname, user, isLoading, router])

  const checkAuth = async () => {
    setIsLoading(true)
    try {
      const storedEmail = localStorage.getItem('email')
      const storedPassword = localStorage.getItem('password')
      
      if (storedEmail && storedPassword) {
        try {
          const res = await apiClient.post('/login', {
            email: storedEmail,
            password: storedPassword,
          })
          
          setUser(res.data.user)
          setServerAvailable(true)
        } catch (error: any) {
          if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
            console.error('Backend server unavailable')
            setServerAvailable(false)
            
            toast({
              title: "Server unavailable",
              description: "Unable to connect to the authentication server. Please try again later.",
              variant: "destructive",
            })
          } else {
            console.error('Auth validation error', error)
            localStorage.removeItem('email')
            localStorage.removeItem('password')
          }
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check error', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await apiClient.post('/login', {
        email,
        password,
      })
      
      localStorage.setItem('email', email)
      localStorage.setItem('password', password)
      
      setUser(res.data.user)
      setServerAvailable(true)
      
      const redirectPath = sessionStorage.getItem('redirectAfterLogin')
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin')
        router.push(redirectPath)
      } else {
        router.push('/dashboard')
      }
      
      return res.data
    } catch (error: any) {
      if (error.code === 'ECONNABORTED' || error.message.includes('Network Error')) {
        setServerAvailable(false)
        toast({
          title: "Server unavailable",
          description: "Unable to connect to the authentication server. Make sure the backend server is running.",
          variant: "destructive",
        })
      } else {
        const errorMessage = error.response?.data?.error || 'Failed to login'
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        })
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('password')
    setUser(null)
    router.push('/')
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    serverAvailable
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
