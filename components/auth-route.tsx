"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/loading-spinner"

interface AuthRouteProps {
  children: React.ReactNode
}

export function AuthRoute({ children }: AuthRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      })
      
      sessionStorage.setItem('redirectAfterLogin', pathname || '')
      
      router.push('/login')
    }
  }, [user, isLoading, router, pathname])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" variant="default" />
      </div>
    )
  }
  
  if (!isLoading && user) {
    return <>{children}</>
  }
  
  return null
} 