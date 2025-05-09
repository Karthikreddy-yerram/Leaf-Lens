"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { ArrowLeft, Loader2, MailQuestion } from "lucide-react"
import { motion } from "framer-motion"
import axios from "axios"
import { Header } from "@/components/header"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [emailValid, setEmailValid] = useState(false)

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setEmailValid(emailRegex.test(email))
  }, [email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!emailValid) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)
    
    try {
      await axios.post("http://localhost:5000/request_reset", { email })
      setIsSubmitted(true)
    } catch (error: any) {
      setError(
        error.response?.data?.message || 
        "Failed to send password reset email. Please try again."
      )
    } finally {
      setIsSubmitting(false)
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
              <MailQuestion className="h-5 w-5 text-primary" />
              Forgot password
            </CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a password reset link
            </CardDescription>
          </CardHeader>
          {!isSubmitted ? (
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
                  disabled={isSubmitting || !emailValid}
                >
                  <span className="relative z-10">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
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
          ) : (
            <CardContent className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 text-green-800 dark:text-green-300 p-4 rounded-lg"
              >
                <p className="text-sm">
                  If an account exists with that email, we've sent a password reset link.
                  Please check your inbox and spam folders.
                </p>
              </motion.div>
              <div className="text-center pt-4">
                <Link href="/login" className="text-primary hover:underline font-medium flex items-center justify-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  )
} 