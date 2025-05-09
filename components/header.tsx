"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/use-auth"
import { Menu, X, Leaf, LogOut, Home, User, FolderSearch, ChevronRight, Sparkles, ExternalLink, MessageSquare, Settings, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user) {
      const adminStatus = localStorage.getItem('isAdmin')
      setIsAdmin(adminStatus === 'true')
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/identify", label: "Identify Plant", icon: FolderSearch, requiresAuth: true },
    { href: "/about", label: "About", icon: User },
    { href: "/feedback", label: "Feedback", icon: MessageSquare, requiresAuth: true },
  ]

  if (user) {
    navLinks.push({ href: "/dashboard", label: "Dashboard", icon: User, requiresAuth: true })
    navLinks.push({ href: "/settings", label: "Settings", icon: Settings, requiresAuth: true })
    
    if (isAdmin) {
      navLinks.push({ href: "/admin", label: "Admin", icon: Shield, requiresAuth: true })
    }
  }

  const headerVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const mobileMenuVariants = {
    closed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    open: { opacity: 1, height: "auto", transition: { duration: 0.3, ease: "easeInOut" } },
  }

  const linkVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.05, duration: 0.3 }
    }),
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 }
    }
  }

  const mobileLinkVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.05, duration: 0.3 }
    }),
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 }
    }
  }

  const mobileNavVariants = {
    initial: { opacity: 0, x: -10 },
    animate: (i: number) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.05, duration: 0.3 }
    }),
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 }
    }
  }

  const handleProtectedNavigation = (e: React.MouseEvent<HTMLAnchorElement>, requiresAuth: boolean) => {
    if (requiresAuth && !user) {
      e.preventDefault()
      sessionStorage.setItem('redirectAfterLogin', e.currentTarget.pathname)
      router.push('/login')
    }
  }

  return (
    <motion.header 
      initial="initial"
      animate="animate"
      variants={headerVariants}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/85 backdrop-blur-md border-b"
    >
      <div className="container flex items-center justify-between py-3">
        {}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Leaf className="h-6 w-6 text-primary" />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                  x: [0, 5, 0],
                  y: [0, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatType: "reverse",
                  delay: 1
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-3 w-3 text-yellow-400" />
              </motion.div>
            </motion.div>
            <div className="overflow-hidden relative">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Leaf-Lens
              </motion.span>
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-green-500 to-emerald-700"
                initial={{ scaleX: 0, originX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        </Link>

        {}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link, i) => (
              <motion.li 
                key={link.href}
                custom={i}
                initial="initial"
                animate="animate"
                whileHover="hover"
                variants={linkVariants}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center gap-1 py-1.5 px-3 rounded-md relative overflow-hidden group",
                    pathname === link.href 
                      ? "text-primary-foreground bg-primary" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                  onClick={(e) => handleProtectedNavigation(e, !!link.requiresAuth)}
                >
                  <link.icon className={cn(
                    "h-4 w-4 transition-colors mr-1.5",
                    pathname === link.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                  <span>{link.label}</span>
                  
                  {pathname === link.href ? (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary rounded-md -z-10"
                      transition={{ duration: 0.3 }}
                    />
                  ) : null}
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ModeToggle />
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" onClick={logout} className="gap-1 border-primary/20 hover:bg-primary/5 relative overflow-hidden group">
                  <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  <span>Logout</span>
                </Button>
              </motion.div>
            ) : (
              <div className="flex items-center gap-2">
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button asChild variant="ghost" size="sm" className="relative overflow-hidden group px-3 py-1 h-8">
                    <Link href="/login" className="flex items-center gap-1">
                      <span>Login</span>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden rounded-md"
                >
                  <Button size="sm" asChild className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 relative overflow-hidden">
                    <Link href="/signup" className="flex items-center gap-1">
                      <span>Sign Up</span>
                      <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </nav>

        {}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-background/95 backdrop-blur-md border-t overflow-hidden"
          >
            <div className="container py-4">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "text-sm font-medium transition-all hover:text-primary block py-2 px-3 rounded-md flex items-center gap-2",
                        pathname === link.href 
                          ? "text-primary-foreground bg-primary" 
                          : "text-muted-foreground hover:bg-primary/5"
                      )}
                      onClick={(e) => {
                        handleProtectedNavigation(e, !!link.requiresAuth)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + (i * 0.05) }}
                        className="h-1 w-1 rounded-full bg-primary-foreground ml-auto"
                      />
                    </Link>
                  </motion.li>
                ))}
                {user ? (
                  <motion.li
                    custom={navLinks.length}
                    variants={linkVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 mt-2 relative overflow-hidden group"
                    >
                      <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                      <span>Logout</span>
                    </Button>
                  </motion.li>
                ) : (
                  <>
                    <motion.li
                      custom={navLinks.length}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <Button variant="outline" size="sm" asChild className="w-full mt-2 relative overflow-hidden group">
                        <Link href="/login" className="flex items-center justify-center gap-1">
                          <span>Login</span>
                        </Link>
                      </Button>
                    </motion.li>
                    <motion.li
                      custom={navLinks.length + 1}
                      variants={linkVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                    >
                      <Button size="sm" asChild className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0 mt-1 relative overflow-hidden">
                        <Link href="/signup" className="flex items-center justify-center gap-1">
                          <span>Sign Up</span>
                          <ExternalLink className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-1" />
                          <motion.div 
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                          />
                        </Link>
                      </Button>
                    </motion.li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
