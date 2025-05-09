"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { KeyRound, Eye, EyeOff, CheckCircle2, Check, X, Loader2, ArrowLeft } from "lucide-react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [error, setError] = useState("")
  const [token, setToken] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [validating, setValidating] = useState(true)
  
  const [passwordLengthValid, setPasswordLengthValid] = useState(false)
  const [passwordHasLetters, setPasswordHasLetters] = useState(false)
  const [passwordHasNumbers, setPasswordHasNumbers] = useState(false)
  const [passwordHasSpecial, setPasswordHasSpecial] = useState(false)

  useEffect(() => {
    setPasswordLengthValid(password.length >= 8)
    setPasswordHasLetters(/[a-zA-Z]/.test(password))
    setPasswordHasNumbers(/[0-9]/.test(password))
    setPasswordHasSpecial(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
  }, [password])
  
  const isPasswordStrong = passwordLengthValid && 
                          passwordHasLetters && 
                          passwordHasNumbers && 
                          passwordHasSpecial
                          
  const canSubmit = isPasswordStrong && password === confirmPassword && tokenValid

  useEffect(() => {
    const token = searchParams.get("token")
    setToken(token)

    if (token) {
      validateToken(token)
    } else {
      setValidating(false)
      setTokenValid(false)
      setError("Invalid or missing reset token")
    }
  }, [searchParams])

  const validateToken = async (token: string) => {
    try {
      const response = await axios.post("http://localhost:5000/validate_token", { token })
      setTokenValid(true)
    } catch (error) {
      console.error("Token validation error:", error)
      setTokenValid(false)
      setError("Invalid or expired reset token")
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isPasswordStrong) {
      setError("Password does not meet the requirements")
      return
    }
    
    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const response = await axios.post("http://localhost:5000/reset_password", {
        token,
        new_password: password
      })
      
      setResetSuccess(true)
    } catch (error: any) {
      console.error("Password reset error:", error)
      setError(error.response?.data?.error || "Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
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

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Header />
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validating Reset Link</CardTitle>
            <CardDescription>Please wait while we verify your reset link...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
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
              {resetSuccess ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <KeyRound className="h-5 w-5 text-primary" />
              )}
              {resetSuccess ? "Password Reset Complete" : "Create New Password"}
            </CardTitle>
            <CardDescription>
              {resetSuccess 
                ? "Your password has been successfully updated" 
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          {!tokenValid && !validating ? (
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-800 dark:text-red-300 p-4 rounded-lg"
              >
                <p className="text-sm">
                  {error || "Invalid or expired password reset link. Please request a new one."}
                </p>
              </motion.div>
              <div className="text-center pt-4">
                <Button 
                  className="w-full group relative overflow-hidden"
                  onClick={() => router.push("/forgot-password")}
                >
                  <span className="relative z-10">Request New Reset Link</span>
                  <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
            </CardContent>
          ) : resetSuccess ? (
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-800 dark:text-green-300 p-4 rounded-lg"
              >
                <p className="text-sm">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
              </motion.div>
              <div className="text-center pt-4">
                <Button 
                  className="w-full group relative overflow-hidden"
                  onClick={() => router.push("/login")}
                >
                  <span className="relative z-10">Go to Login</span>
                  <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-2 focus:border-primary pr-10"
                      placeholder="Enter new password"
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
                      placeholder="Confirm your password"
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
                  disabled={isSubmitting || !canSubmit}
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </span>
                  {!isSubmitting && (
                    <span className="absolute inset-0 bg-primary-foreground/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                  )}
                </Button>
                <div className="text-center text-sm">
                  <Link href="/login" className="text-primary hover:underline font-medium flex items-center justify-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Back to login
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
} 