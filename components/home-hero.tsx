"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Leaf, Sparkles, ChevronDown, Scan } from "lucide-react"

export function HomeHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline()

    tl.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
      .fromTo(imageRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.5")
      .fromTo(".hero-button", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }, "-=0.5")

    document.addEventListener('mousemove', (e) => {
      if (heroRef.current) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        gsap.to('.floating-leaf', {
          x: moveX,
          y: moveY,
          duration: 1,
          ease: 'power1.out'
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      document.removeEventListener('mousemove', () => {});
    }
  }, [])

  const floatingLeaves = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 20 + 10,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
    rotate: Math.random() * 360,
    opacity: Math.random() * 0.4 + 0.1,
  }))

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-green-700 via-green-600 to-green-800 dark:from-green-900 dark:via-green-800 dark:to-green-900 z-0" />
      
      {}
      <div 
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='white' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {}
      {floatingLeaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-green-200/30 dark:text-green-200/20 z-0 floating-leaf"
          style={{
            left: leaf.left,
            top: "-50px",
            opacity: leaf.opacity,
          }}
          animate={{
            y: ["0vh", "100vh"],
            rotate: [0, leaf.rotate],
          }}
          transition={{
            duration: leaf.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: leaf.delay,
            ease: "linear",
          }}
        >
          <Leaf size={leaf.size} />
        </motion.div>
      ))}

      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 relative z-10 px-6 md:px-8 lg:px-12">
        <div ref={textRef} className="flex flex-col justify-center pl-2 sm:pl-4 md:pl-6 lg:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-3 py-1.5 text-sm font-medium text-white border border-white/20 shadow-sm">
              <Sparkles className="mr-1.5 h-3.5 w-3.5 text-yellow-300" />
              ML-Powered Plant Identification
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white"
          >
            Discover the Power of{" "}
            <span className="text-green-200 relative z-10">
              Medicinal Plants
              <span className="absolute bottom-2 left-0 w-full h-2 bg-green-400/30 -z-10 transform -rotate-1"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-green-100/90 max-w-md"
          >
            Identify medicinal plants instantly with our advanced ML technology. Learn about their properties, uses, and
            benefits with just a photo.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4 mt-8 relative">
            <Button size="lg" asChild className="hero-button w-full sm:w-auto min-w-[180px] group relative overflow-hidden bg-white text-green-800 hover:bg-green-100 border-0 shadow-lg shadow-green-800/20">
              <Link href="/identify" className="flex items-center justify-center">
                <Scan className="mr-2 h-4 w-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Identify Plant</span>
                <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-green-100 to-green-200"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="hero-button w-full sm:w-auto min-w-[180px] group border-2 border-white/80 backdrop-blur-sm hover:bg-white/20 text-white shadow-lg shadow-green-800/10 relative overflow-hidden">
              <Link href="/about" className="flex items-center justify-center">
                <span className="relative z-10 font-medium">Learn More</span>
                <ArrowRight className="ml-2 h-4 w-4 relative z-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-green-500/40 to-green-600/40"
                  initial={{ y: "100%" }}
                  whileHover={{ y: "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute -inset-px rounded-md bg-gradient-to-r from-green-400 to-green-600 opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300"
                />
              </Link>
            </Button>
          </div>
        </div>

        <div ref={imageRef} className="flex items-center justify-center relative">
          <motion.div 
            className="relative w-full max-w-md aspect-square"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="absolute -inset-0.5 bg-gradient-to-br from-green-300 via-green-400 to-green-500 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition duration-500"
              animate={{ 
                rotate: [0, 2, 0, -2, 0],
                scale: [1, 1.02, 1, 1.02, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <div className="relative bg-gradient-to-br from-green-900/90 via-green-800/90 to-green-900/90 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="absolute inset-0 z-0">
                <img
                  src="/bg-leaf-microscope.jpg"
                  alt="Leaf microscope background"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 to-green-800/50"></div>
              </div>
              <div className="relative z-10 aspect-square flex flex-col justify-end p-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-200">
                    Identify 80+ Medicinal Plants
                  </h3>
                  <p className="text-sm text-green-100/90 mb-4">
                    Our ML model can recognize various medicinal plants from a simple leaf photo
                  </p>
                  
                  {}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      "Instant recognition",
                      "Multilingual support",
                      "Voice readout",
                      "Historical tracking"
                    ].map((feature, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="flex items-center text-sm text-white group"
                        whileHover={{ scale: 1.05, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-green-300 mr-2 group-hover:bg-green-200 transition-colors" />
                        <span className="group-hover:text-green-200 transition-colors">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {}
      <div className="hidden lg:flex absolute right-12 bottom-12 items-center gap-2 text-white/80 text-sm bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-white/20 hover:bg-white/20 transition-colors">
        <span className="font-medium">Scroll to explore</span>
        <ChevronDown className="animate-bounce h-4 w-4" />
      </div>

      {}
      <div className="flex lg:hidden absolute bottom-8 left-1/2 -translate-x-1/2 items-center flex-col gap-1.5 text-white/80 text-sm bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-white/20 hover:bg-white/20 transition-colors">
        <span className="font-medium">Scroll to explore</span>
        <ChevronDown className="animate-bounce h-4 w-4" />
      </div>
    </div>
  )
}
