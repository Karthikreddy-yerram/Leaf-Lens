"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Leaf, Trash2, Volume2, Calendar, ChevronRight, Search, X, Grid, List, ArrowUpRight, Clock, Plus, Share2, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { format } from 'date-fns'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AuthRoute } from "@/components/auth-route"

interface HistoryEntry {
  id: string
  userId: string
  plantName: string
  confidence: number
  imageUrl: string
  timestamp: string
  saved?: boolean
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number = 0) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      delay,
      ease: "easeOut" 
    } 
  }),
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { 
      duration: 0.3,
      ease: "easeIn"
    } 
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07
    }
  }
}

export default function DashboardPage() {
  return (
    <AuthRoute>
      <DashboardContent />
    </AuthRoute>
  )
}

function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    fetchHistory()
  }, [user, router])

  const fetchHistory = async () => {
    if (!user) return
    setIsLoading(true)
    
    try {
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')

      if (!email || !password) {
        router.push('/login')
        return
      }

      const res = await axios.post('http://localhost:5000/get_history', {
        email,
        password,
      })

      let backendHistory: HistoryEntry[] = res.data.map(
        (item: any) => {
          let imageUrl = '/placeholder.svg'
          
          if (item.imageUrl) {
            imageUrl = item.imageUrl.startsWith('blob:') 
              ? '/placeholder.svg'
              : item.imageUrl.startsWith('http')
                ? item.imageUrl
                : `http://localhost:5000${item.imageUrl.startsWith('/') ? '' : '/'}${item.imageUrl}`
          }
          
          const entry: HistoryEntry = {
            id: item.id || item._id || '',
            userId: item.userId || '',
            plantName: item.plantName || 'Unknown Plant',
            confidence: item.confidence || 0,
            imageUrl: imageUrl,
            timestamp: item.timestamp || new Date().toISOString(),
            saved: true
          }
          
          return entry
        }
      )

      backendHistory.sort((a, b) => {
        const dateA = new Date(a.timestamp || 0).getTime()
        const dateB = new Date(b.timestamp || 0).getTime()
        return dateB - dateA
      })

      setHistory(backendHistory)
      } catch (error) {
      console.error('Failed to load history:', error)
        toast({ title: "Error loading history", variant: "destructive" })
      } finally {
      setIsLoading(false)
      }
    }

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?") || !user) return
    setIsDeleting(true)

    try {
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')

      await axios.post('http://localhost:5000/delete_entry', {
        email,
        password,
        entry_id: entryId,
      })

      setHistory(history.filter(entry => entry.id !== entryId))
      toast({ title: "🗑️ Entry deleted from history" })
    } catch (error) {
      console.error('Failed to delete entry:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClearHistory = async () => {
    if (!confirm("Are you sure you want to clear your entire history?")) return
    setIsDeleting(true)

    try {
      const email = localStorage.getItem('email')
      const password = localStorage.getItem('password')

      await axios.post('http://localhost:5000/clear_history', {
        email,
        password,
      })

      setHistory([])
    toast({ title: "🧹 History cleared" })
    } catch (error) {
      console.error('Failed to clear history:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const viewPlantDetails = (id: string) => {
    router.push(`/identify?id=${id}`)
  }

  const filteredHistory = history.filter(entry =>
    entry.plantName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner variant="default" size="lg" type="gradient" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Clock className="w-4 h-4 mr-2" />
          Your Identification History
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Plant History
          </span>
          </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          View and manage your previously identified medicinal plants.
        </p>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="mb-8 border overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search plants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                />
                {searchQuery && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery('')} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </motion.button>
                )}
              </div>
              
              <div className="flex gap-3 items-center">
                <div className="border rounded-lg flex overflow-hidden shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "rounded-none border-0 transition-all duration-200", 
                      viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''
                    )}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "rounded-none border-0 transition-all duration-200", 
                      viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/identify')}
                  className="gap-1 border-primary/30 hover:bg-primary/10 hover:border-primary transition-colors duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>New</span>
              </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  disabled={isDeleting || history.length === 0}
                  className="gap-1 border-destructive/30 hover:bg-destructive/10 hover:border-destructive text-destructive hover:text-destructive transition-colors duration-300"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear</span>
              </Button>
              </div>
            </div>
            </CardContent>
          </Card>
        </motion.div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-20"
          >
            <LoadingSpinner variant="default" size="md" />
          </motion.div>
        ) : filteredHistory.length === 0 ? (
          <motion.div
            key="empty"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Leaf className="h-10 w-10 text-primary opacity-70" />
              </div>
            <h3 className="text-xl font-semibold mb-2">No plants found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchQuery 
                ? `No plants matching "${searchQuery}" in your history. Try another search.`
                : "You haven't identified any plants yet. Start by identifying a new plant."}
            </p>
            <Button onClick={() => router.push('/identify')} className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
              <Plus className="h-4 w-4" />
              Identify New Plant
                </Button>
          </motion.div>
        ) : (
          <>
            <motion.div
              key="results"
              className="mb-4 flex justify-between items-center"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
            >
              <p className="text-sm text-muted-foreground">
                Showing {filteredHistory.length} {filteredHistory.length === 1 ? 'result' : 'results'}
                {searchQuery && <span> for "<span className="font-medium text-foreground">{searchQuery}</span>"</span>}
              </p>
            </motion.div>
            
            {viewMode === 'grid' ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredHistory.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    variants={fadeIn}
                    custom={i * 0.05}
                    layoutId={`plant-${entry.id}`}
                    className="group"
                  >
                    <div 
                      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 group-hover:opacity-0 transition-opacity duration-300" />
                        
                        {}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <img 
                          src={entry.imageUrl} 
                          alt={entry.plantName} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                          <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <div className="flex items-center justify-between">
                              <span className="bg-white/90 dark:bg-gray-900/90 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
                                {Math.round(entry.confidence * 100)}% confidence
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(entry.id);
                                  }}
                                  className="p-2 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-red-500 hover:text-white backdrop-blur-sm transition-colors duration-200"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}
                                  className="p-2 rounded-full bg-white/90 dark:bg-gray-900/90 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-colors duration-200"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors duration-300">
                          {entry.plantName}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.timestamp ? format(new Date(entry.timestamp), 'MMM d, yyyy') : 'Unknown date'}
                        </p>
                        
                        <div className="mt-auto">
                          <Button 
                            onClick={() => viewPlantDetails(entry.id)}
                            variant="ghost" 
                            className="w-full justify-between hover:bg-primary/10 hover:text-primary group-hover:bg-primary/5 transition-colors duration-300"
                          >
                            <span>View Details</span>
                            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {filteredHistory.map((entry, i) => (
                  <motion.div 
                    key={entry.id}
                    variants={fadeIn}
                    custom={i * 0.05}
                    layoutId={`plant-list-${entry.id}`}
                    className="group"
                    onClick={() => viewPlantDetails(entry.id)}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-row hover:border-primary/30 dark:hover:border-primary/30">
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                        <img 
                          src={entry.imageUrl} 
                          alt={entry.plantName} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                            {entry.plantName}
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {Math.round(entry.confidence * 100)}%
                          </span>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {entry.timestamp ? format(new Date(entry.timestamp), 'MMM d, yyyy') : 'Unknown date'}
                        </p>
                      </div>
                      
                      <div className="flex flex-col justify-center pr-4 gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(entry.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 rounded-full text-muted-foreground"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
              )}
      </AnimatePresence>
    </div>
  )
}
