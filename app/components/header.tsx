'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LucideMenu, Leaf, LogOut, LogIn, UserPlus, Settings, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/mode-toggle'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

export function Header() {
  const { isAuthenticated } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated) {
        try {
          const email = localStorage.getItem('email')
          const password = localStorage.getItem('password')

          if (email && password) {
            const response = await fetch('http://localhost:5000/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password }),
            })

            const data = await response.json()
            if (response.ok && data.user && data.user.isAdmin) {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
            }
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      } else {
        setIsAdmin(false)
      }
    }
    
    checkAdminStatus()
  }, [isAuthenticated])

  const authLinks = isAuthenticated
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: User },
        { href: '/settings', label: 'Settings', icon: Settings },
        ...(isAdmin ? [{ href: '/admin', label: 'Admin', icon: Shield }] : []),
      ]
    : [
        { href: '/login', label: 'Login', icon: LogIn },
        { href: '/signup', label: 'Sign Up', icon: UserPlus },
      ]

  return (
    <div className="flex items-center justify-between">
      {}
    </div>
  )
} 