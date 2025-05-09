'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, Settings, User, ToggleLeft, ToggleRight, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface UserData {
  username: string
  email: string
  isAdmin: boolean
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [adminEmail, setAdminEmail] = useState<string>('')
  const [adminPassword, setAdminPassword] = useState<string>('')
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('email') || ''
    const password = localStorage.getItem('password') || ''
    setAdminEmail(email)
    setAdminPassword(password)

    fetchUsers(email, password)
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          user => 
            user.username.toLowerCase().includes(query) || 
            user.email.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, users])

  const fetchUsers = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdmin = async (user: UserData) => {
    if (adminEmail === user.email) {
      toast.error("You cannot change your own admin status")
      return
    }

    setUpdatingUser(user.email)
    try {
      const response = await fetch('http://localhost:5000/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail,
          adminPassword,
          targetEmail: user.email,
          isAdmin: !user.isAdmin
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      setUsers(users.map(u => {
        if (u.email === user.email) {
          return { ...u, isAdmin: !u.isAdmin }
        }
        return u
      }))

      toast.success(`${user.username} admin status updated`)
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user. Please try again.')
    } finally {
      setUpdatingUser(null)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users and system settings
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="px-3 py-1 text-primary border-primary">
              <Shield className="h-3 w-3 mr-1" /> Admin Mode
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" /> System Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system
                </CardDescription>
                <div className="flex w-full items-center space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by username or email..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fetchUsers(adminEmail, adminPassword)}
                  >
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <LoadingSpinner />
                    <span className="ml-2">Loading users...</span>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-muted p-4 font-medium">
                      <div className="col-span-4">User</div>
                      <div className="col-span-5">Email</div>
                      <div className="col-span-3 text-right">Admin Status</div>
                    </div>
                    {filteredUsers.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No users found
                      </div>
                    ) : (
                      <div className="divide-y">
                        {filteredUsers.map((user) => (
                          <div 
                            key={user.email} 
                            className="grid grid-cols-12 items-center p-4 text-sm"
                          >
                            <div className="col-span-4 flex items-center gap-2.5">
                              <div className="bg-primary/10 text-primary rounded-full h-8 w-8 flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{user.username}</span>
                            </div>
                            <div className="col-span-5 text-muted-foreground">
                              {user.email}
                            </div>
                            <div className="col-span-3 flex justify-end items-center">
                              {updatingUser === user.email ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`admin-status-${user.email}`}
                                    checked={user.isAdmin}
                                    onCheckedChange={() => handleToggleAdmin(user)}
                                    disabled={adminEmail === user.email}
                                  />
                                  <Label htmlFor={`admin-status-${user.email}`} className="cursor-pointer">
                                    {user.isAdmin ? (
                                      <span className="flex items-center text-primary">
                                        <ToggleRight className="h-4 w-4 mr-1" /> Admin
                                      </span>
                                    ) : (
                                      <span className="flex items-center text-muted-foreground">
                                        <ToggleLeft className="h-4 w-4 mr-1" /> User
                                      </span>
                                    )}
                                  </Label>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <p className="text-muted-foreground">
                      This section is currently under development. 
                      <br />
                      Additional admin features will be available soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
} 