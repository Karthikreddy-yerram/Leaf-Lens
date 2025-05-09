"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import axios from "axios"
import { AlertTriangle, Trash2, X, AlertCircle, Key, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"

export function AccountDeleteSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleCloseModal()
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setPassword("")
    setConfirmation(false)
    setError("")
  }

  const handleCloseModal = () => {
    if (!isDeleting) {
      setIsModalOpen(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!password) {
      setError("Please enter your password to confirm deletion")
      return
    }

    if (!confirmation) {
      setError("Please confirm that you understand this action is permanent")
      return
    }

    setError("")
    setIsDeleting(true)

    try {
      setIsChecking(true)
      const email = localStorage.getItem("email")
      
      await axios.post("http://localhost:5000/delete_account", {
        email,
        password,
        confirmation: "DELETE"
      })
      
      setIsChecking(false)
      setIsDeleting(false)
      setShowSuccess(true)
      
      toast({
        title: "Account deleted successfully",
        description: "Your account and all associated data have been removed",
      })
      
      setTimeout(() => {
        setShowSuccess(false)
        setIsModalOpen(false)
        
        localStorage.removeItem("email")
        localStorage.removeItem("password")
        localStorage.removeItem("userId")
        
        setTimeout(() => {
          router.push("/")
        }, 300)
      }, 2000)
    } catch (err: any) {
      setIsDeleting(false)
      setIsChecking(false)
      const errorMessage = err.response?.data?.message || "Failed to delete account. Please try again."
      setError(errorMessage)
      toast({
        title: "Error deleting account",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2,
        when: "beforeChildren"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren"
      }
    }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.4,
        bounce: 0.2
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  }

  const successVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        bounce: 0.4
      }
    },
    exit: { 
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  return (
    <div className="border border-destructive/20 rounded-xl bg-destructive/5 p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <UserX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-destructive flex items-center gap-2">
                Delete Account
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenModal}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-red-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200 group-hover:duration-100 animate-pulse group-hover:animate-none">
            </div>
            <div className="relative flex items-center gap-2 bg-destructive hover:bg-destructive/90 px-4 py-2 rounded-lg text-white font-medium transition duration-200">
              <Trash2 className="h-4 w-4" />
              <span>Delete Account</span>
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleOutsideClick}
          >
            {showSuccess ? (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-green-50 dark:bg-green-900/20 p-8 rounded-xl border border-green-100 dark:border-green-800/30 shadow-lg max-w-md w-full text-center"
              >
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800/30 mb-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: 1, 
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 150,
                        damping: 10,
                        delay: 0.2
                      }
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-green-600 dark:text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ 
                          pathLength: 1,
                          transition: { 
                            delay: 0.3,
                            duration: 0.5,
                            type: "spring",
                            stiffness: 50
                          }
                        }}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Account Deleted</h3>
                <p className="text-green-700 dark:text-green-300 text-center">
                  Your account has been successfully deleted. You will be redirected to the home page.
                </p>
              </motion.div>
            ) : (
              <motion.div
                ref={modalRef}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-background border rounded-xl shadow-xl max-w-md w-full overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    <h2 className="font-semibold text-lg">Delete Account</h2>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="rounded-full p-1 hover:bg-muted transition-colors"
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm flex items-start gap-2 mb-4">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Warning: This action cannot be undone</p>
                        <p>
                          Deleting your account will permanently remove all your data, including identification history, 
                          saved plants, and personal information from our systems.
                        </p>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-destructive font-medium">
                          Confirm your password
                        </Label>
                        <div className="relative">
                          <Key className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 border-2 focus:border-destructive"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2 mt-4">
                        <Checkbox 
                          id="confirm" 
                          checked={confirmation} 
                          onCheckedChange={(checked) => setConfirmation(checked as boolean)}
                          className="data-[state=checked]:bg-destructive data-[state=checked]:border-destructive mt-1"
                        />
                        <Label 
                          htmlFor="confirm" 
                          className="text-sm font-normal leading-relaxed"
                        >
                          I understand that deleting my account will permanently remove all my data 
                          and this action cannot be undone.
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCloseModal}
                      disabled={isDeleting}
                      className="border-muted-foreground"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting || isChecking}
                      className="gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <LoadingSpinner className="h-4 w-4" />
                          Deleting Account...
                        </>
                      ) : isChecking ? (
                        <>
                          <LoadingSpinner className="h-4 w-4" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Delete my account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 