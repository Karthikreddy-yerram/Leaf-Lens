"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion"
import { Leaf, BookOpen, Globe, Volume2, History, Moon, Upload, Search, ArrowRight } from "lucide-react"

const features = [
  {
    title: "Plant Identification",
    description: "Identify medicinal plants instantly with our advanced ML technology",
    icon: Search,
    color: "from-green-500 to-emerald-600",
    highlight: true,
  },
  {
    title: "Detailed Information",
    description: "Get comprehensive information about each plant's medicinal properties",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
  },
  {
    title: "Language Translation",
    description: "Translate plant information into multiple languages",
    icon: Globe,
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Text-to-Speech",
    description: "Listen to plant information with adjustable voice controls",
    icon: Volume2,
    color: "from-orange-500 to-red-600",
  },
  {
    title: "History Tracking",
    description: "Access your previously identified plants and information",
    icon: History,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Dark Mode",
    description: "Switch between light and dark themes for comfortable viewing",
    icon: Moon,
    color: "from-violet-500 to-purple-600",
  },
  {
    title: "Easy Upload",
    description: "Drag and drop or select images of plant leaves for identification",
    icon: Upload,
    color: "from-amber-500 to-orange-600",
  },
]

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="h-full"
    >
      <Card
        className={`border h-full transition-all duration-500 group overflow-hidden ${
          feature.highlight 
            ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg hover:shadow-xl' 
            : 'bg-card hover:shadow-md'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardHeader className="pb-2 relative">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-md relative z-0 overflow-hidden`}
          >
            <feature.icon className="h-7 w-7 text-white relative z-10" />
            <motion.div 
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              animate={isHovered ? { x: "100%" } : { x: "-100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
            {feature.title}
            {feature.highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-xs font-normal bg-primary text-primary-foreground py-0.5 px-2 rounded-full ml-2"
              >
                Popular
              </motion.div>
            )}
          </CardTitle>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-6 top-6"
              >
                <ArrowRight className="h-5 w-5 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{feature.description}</p>
          <motion.div 
            className={`h-0.5 w-0 mt-3 rounded-full bg-gradient-to-r ${feature.color}`}
            initial={{ width: 0 }}
            animate={isHovered ? { width: "40%" } : { width: 0 }}
            transition={{ duration: 0.4 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Features() {
  const featuresRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0.3, 0.8, 1]);
  
  return (
    <section ref={featuresRef} className="py-24 relative overflow-hidden">
      {}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div style={{ opacity }} className="absolute inset-0 bg-gradient-to-b from-background to-background/90" />
      
        {}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        
        {}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
        
        {}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-20 w-20 rounded-full bg-primary/5"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-6"
          >
            <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="absolute inset-0 rounded-2xl border-2 border-primary/30 animate-ping opacity-20" />
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent px-4"
          >
            Powerful Features for Plant Enthusiasts
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg text-muted-foreground px-4"
          >
            Discover the comprehensive tools that make Leaf-Lens the ultimate medicinal plant identification platform
          </motion.p>
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mt-8"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
        
        {}
        <motion.div 
          style={{ y }}
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent -z-10"
        />
      </div>
    </section>
  )
}
