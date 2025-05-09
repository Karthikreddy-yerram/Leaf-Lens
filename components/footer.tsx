"use client"

import Link from "next/link"
import { Leaf, Mail, Twitter, Facebook, Instagram, GithubIcon, LinkedinIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 }
    })
  }
  
  const socialIcons = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: GithubIcon, href: "#", label: "GitHub" },
    { icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  ]
  
  return (
    <footer className="relative border-t overflow-hidden">
      {}
      <div className="absolute inset-0 bg-muted/50 dark:bg-muted/30 -z-10" />
      
      {}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
      
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      
      {}
      <div className="container py-12 relative z-10 px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {}
          <motion.div 
            className="md:col-span-2 pl-0 md:pl-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeIn}
          >
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative">
                <Leaf className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute inset-0 bg-primary rounded-full blur-lg -z-10 opacity-30"
                />
              </div>
              <motion.span 
                className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-700 dark:from-green-400 dark:to-emerald-600 text-transparent bg-clip-text"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Leaf-Lens
              </motion.span>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6">
              Leaf-Lens is an advanced medicinal plant identification platform that helps you discover the healing
              properties of plants through ML-powered technology.
            </p>
            
            {}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Stay updated with our advances</h4>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="max-w-xs bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary"
                />
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={fadeIn}
          >
            <h3 className="font-medium text-lg mb-4 border-b pb-2 border-border/50">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/identify", label: "Identify Plant" },
                { href: "/about", label: "About" },
                { href: "/dashboard", label: "Dashboard" },
              ].map((link, i) => (
                <motion.li 
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <span className="h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-2" />
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            variants={fadeIn}
          >
            <h3 className="font-medium text-lg mb-4 border-b pb-2 border-border/50">Connect</h3>
            <ul className="space-y-2 mb-6">
              {[
                { href: "/privacy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map((link, i) => (
                <motion.li 
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            
            {}
            <div className="flex gap-3 mt-4">
              {socialIcons.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/20 transition-colors"
                >
                  <social.icon className="h-4 w-4 text-muted-foreground" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          variants={fadeIn}
        >
          <p className="text-center text-muted-foreground text-sm">
            © {currentYear} Leaf-Lens. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground">Made with</span>
            <span className="relative inline-block">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-red-500"
              >
                ❤️
              </motion.div>
            </span>
            <span className="text-xs text-muted-foreground">by Plant Enthusiasts</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
