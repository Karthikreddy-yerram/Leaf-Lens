'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/loading-spinner'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState<boolean>(true)
  const [authorized, setAuthorized] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true)
      
      try {
        const email = localStorage.getItem('email')
        const password = localStorage.getItem('password')

        if (!email || !password) {
          router.push('/login?redirect=/admin')
          return
        }

        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok && data.user && data.user.isAdmin) {
          setAuthorized(true)
        } else {
          router.push('/')
        }
      } catch (error) {
        console.error('Error verifying admin status:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
        <span className="ml-2 text-lg">Verifying admin access...</span>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {children}
    </div>
  )
} 