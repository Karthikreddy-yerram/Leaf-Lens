"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])
  
  const canSubmit = emailValid && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!emailValid) {
      setError("Please enter a valid email address")
      return
    }

    console.log("Attempting login with:", { email, password })

    setLoading(true)

    try {
      console.log("Sending request to:", "http://localhost:5000/login")
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok) {
        console.log("Login successful, redirecting to dashboard");
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        
        const userData = data.user;
        if (userData) {
          localStorage.setItem("username", userData.username);
          localStorage.setItem("isAdmin", userData.isAdmin.toString());
          console.log("User data stored, admin status:", userData.isAdmin);
        }
        
        window.location.href = "/dashboard";
      } else {
        setError(data.error || data.message || "Login failed")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      if (err.message && err.message.includes('fetch')) {
        setError("Unable to connect to the server. Please ensure the backend is running at http://localhost:5000")
      } else {
        setError(`Error: ${err.message || "Something went wrong. Please try again."}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <Header />

      {}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              Sign in
            </CardTitle>
            <CardDescription>Enter your account credentials to sign in</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex justify-between">
                  <span>Email</span>
                  {email && !emailValid && (
                    <span className="text-xs text-red-500">Invalid email format</span>
                  )}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`border-2 focus:border-primary ${email && !emailValid ? 'border-red-500' : ''}`}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-2 focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded"
                >
                  {error}
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full group relative overflow-hidden" 
                disabled={loading || !canSubmit}
              >
                <span className="relative z-10">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
                {!loading && (
                  <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                )}
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
