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
import { Loader2, User, Eye, EyeOff, Check, X } from "lucide-react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"

export default function SignupPage() {
  const router = useRouter()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const [passwordLengthValid, setPasswordLengthValid] = useState(false)
  const [passwordHasLetters, setPasswordHasLetters] = useState(false)
  const [passwordHasNumbers, setPasswordHasNumbers] = useState(false)
  const [passwordHasSpecial, setPasswordHasSpecial] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  
  useEffect(() => {
    setPasswordLengthValid(password.length >= 8)
    setPasswordHasLetters(/[a-zA-Z]/.test(password))
    setPasswordHasNumbers(/[0-9]/.test(password))
    setPasswordHasSpecial(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
  }, [password])
  
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])
  
  const isPasswordStrong = passwordLengthValid && 
                          passwordHasLetters && 
                          passwordHasNumbers && 
                          passwordHasSpecial
                          
  const canSubmit = username && 
                    emailValid && 
                    isPasswordStrong && 
                    password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!emailValid) {
      setError("Please enter a valid email address")
      return
    }
    
    if (!isPasswordStrong) {
      setError("Password does not meet the requirements")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/login")
      } else {
        setError(data.message || "Signup failed")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  
  const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
    <div className="flex items-center space-x-2">
      {isValid ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={`text-xs ${isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
        {text}
      </span>
    </div>
  )

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
              <User className="h-5 w-5 text-primary" />
              Create an account
            </CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-2 focus:border-primary"
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
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
                
                {}
                <div className="mt-2 space-y-1 bg-muted/40 p-3 rounded-md">
                  <h4 className="text-xs font-medium mb-1">Password requirements:</h4>
                  <ValidationItem 
                    isValid={passwordLengthValid}
                    text="At least 8 characters long"
                  />
                  <ValidationItem 
                    isValid={passwordHasLetters}
                    text="Contains letters"
                  />
                  <ValidationItem 
                    isValid={passwordHasNumbers}
                    text="Contains numbers"
                  />
                  <ValidationItem 
                    isValid={passwordHasSpecial}
                    text="Contains special characters (e.g. !@#$%^&*)"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex justify-between">
                  <span>Confirm Password</span>
                  {confirmPassword && password !== confirmPassword && (
                    <span className="text-xs text-red-500">Passwords don't match</span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`border-2 focus:border-primary pr-10 ${
                      confirmPassword && password !== confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-primary"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </span>
                {!loading && (
                  <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
