"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, User, Key, Trash2, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LoadingSpinner } from "@/components/loading-spinner"
import { AccountDeleteSection } from "@/components/account-delete"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import axios from "axios"

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState("account")

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [historySync, setHistorySync] = useState(true)

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedEmail = localStorage.getItem("email")
      const storedPassword = localStorage.getItem("password")
      
      if (!storedEmail || !storedPassword) {
        router.push("/login")
        return
      }
      
      setEmail(storedEmail)
      
      try {
        const res = await axios.post('http://localhost:5000/login', {
          email: storedEmail,
          password: storedPassword
        })
        
        if (res.data && res.data.user) {
          setName(res.data.user.username || '')
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({ 
          title: "Error loading profile", 
          description: "Please log in again", 
          variant: "destructive" 
        })
        router.push("/login")
      }
    }
    
    checkAuthentication()
  }, [router, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    
    try {
      const storedPassword = localStorage.getItem("password")
      await axios.post('http://localhost:5000/update_profile', {
        email,
        password: storedPassword,
        username: name
      })
      
      toast({ title: "Profile updated successfully" })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({ 
        title: "Failed to update profile", 
        variant: "destructive" 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast({ 
        title: "Passwords don't match", 
        description: "New password and confirmation must match",
        variant: "destructive" 
      })
      return
    }
    
    setIsUpdating(true)
    
    try {
      await axios.post('http://localhost:5000/change_password', {
        email,
        current_password: currentPassword,
        new_password: newPassword
      })
      
      localStorage.setItem("password", newPassword)
      
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      
      toast({ title: "Password changed successfully" })
    } catch (error: any) {
      console.error("Error changing password:", error)
      const errorMessage = error.response?.data?.message || "Failed to change password"
      toast({ 
        title: "Failed to change password", 
        description: errorMessage,
        variant: "destructive" 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateSettings = async () => {
    setIsUpdating(true)
    
    try {
      await axios.post('http://localhost:5000/update_settings', {
        email,
        password: localStorage.getItem("password"),
        settings: {
          email_notifications: emailNotifications,
          history_sync: historySync
        }
      })
      
      toast({ title: "Settings updated successfully" })
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({ 
        title: "Failed to update settings", 
        variant: "destructive" 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Account Settings
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your profile, security, and application preferences.
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg mx-auto">
          <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Key className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="w-4 h-4 mr-2" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="delete" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      disabled 
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Your email address cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner className="h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <AccountDeleteSection />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner className="h-4 w-4" />
                        Updating...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your plant identifications
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>History Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync your plant history across devices
                    </p>
                  </div>
                  <Switch 
                    checked={historySync} 
                    onCheckedChange={setHistorySync} 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleUpdateSettings}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner className="h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      'Save Preferences'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delete">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="w-5 h-5" />
                  <span>Account Deletion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  When you delete your account, all your data will be permanently removed from our systems.
                  This includes your identification history, saved plants, and all personal information.
                </p>
                
                <AccountDeleteSection />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 