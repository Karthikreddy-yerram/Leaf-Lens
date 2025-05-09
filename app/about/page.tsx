"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { WhoCanBenefit } from "@/components/who-can-benefit"
import { 
  Leaf, 
  Code, 
  Brain, 
  Globe, 
  Volume2, 
  BarChart, 
  Microscope, 
  Lock, 
  User, 
  Database, 
  Languages, 
  Shield,
  Zap,
  Smartphone,
  HeartPulse,
  Check
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5 }
  })
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const featureCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  hover: { 
    y: -8, 
    boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  }
}

const rotateInVariants = {
  hidden: { opacity: 0, rotate: -5, scale: 0.95 },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const pulseAnimation = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity }
  }
}

export default function AboutPage() {
  return (
    <div className="pb-20">
      {}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -z-10" />
        
        {}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent" />
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          {[...Array(5)].map((_, i) => (
            <motion.div 
              key={i}
              className="absolute rounded-full bg-green-500/10 dark:bg-green-500/5"
              style={{
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 10 - 5],
                y: [0, Math.random() * 10 - 5],
                scale: [1, Math.random() * 0.1 + 0.95, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div 
              custom={0}
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-green-400/80 to-green-600/80 dark:from-green-600/80 dark:to-green-400/80 text-white shadow-lg shadow-green-500/20 backdrop-blur-sm"
            >
              <Leaf className="w-4 h-4 mr-2" />
              About Leaf-Lens
            </motion.div>
            
            <motion.h1 
              custom={1}
              variants={fadeIn}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 relative"
            >
              <span className="relative inline-block">
                <span className="text-green-600 dark:text-green-400">ML-Based</span>
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-green-400 dark:bg-green-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
              {" "}Medicinal Plant Identification Platform
            </motion.h1>
            
            <motion.p 
              custom={2}
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed"
            >
              Discover nature's healing potential through advanced machine learning and comprehensive plant information
            </motion.p>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
            >
              {[
                { icon: <Brain className="w-8 h-8" />, text: "ML Model", color: "green" },
                { icon: <Globe className="w-8 h-8" />, text: "15+ Languages", color: "blue" },
                { icon: <Volume2 className="w-8 h-8" />, text: "Text-to-Speech", color: "purple" },
                { icon: <HeartPulse className="w-8 h-8" />, text: "Medicinal Data", color: "amber" }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  variants={featureCardVariants}
                  whileHover="hover"
                  className="flex flex-col items-center group"
                >
                  <motion.div 
                    className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 mb-3 relative overflow-hidden shadow-lg shadow-${item.color}-500/20 group-hover:shadow-xl group-hover:shadow-${item.color}-500/30 transition-all duration-300`}
                    animate="pulse"
                    variants={pulseAnimation}
                  >
                    {item.icon}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br from-${item.color}-400/0 to-${item.color}-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    />
                  </motion.div>
                  <p className="font-semibold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {}
      <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute -left-10 top-1/4 w-40 h-40 rounded-full bg-green-500/50 blur-3xl" />
          <div className="absolute right-10 bottom-1/4 w-60 h-60 rounded-full bg-blue-500/50 blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.h2 
              custom={0}
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400"
            >
              Platform Overview
            </motion.h2>
            <motion.p 
              custom={1}
              variants={fadeIn}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Leaf-Lens is a comprehensive ML-based web application designed to identify medicinal plants and provide detailed information in multiple languages.
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative aspect-video"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-xl -rotate-3 shadow-lg" 
                initial={{ rotate: -5, scale: 0.95 }}
                whileInView={{ rotate: -3, scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-xl rotate-2 overflow-hidden shadow-lg"
                initial={{ rotate: 5, scale: 0.95 }}
                whileInView={{ rotate: 2, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      className="flex flex-col items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.1, 1, 1.1, 1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Leaf className="w-16 h-16 text-green-500 drop-shadow-lg" />
                      </motion.div>
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Leaf-Lens Interface</p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-6"
            >
              <motion.h3 
                custom={0}
                variants={fadeIn}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400"
              >
                Full-Stack Architecture
              </motion.h3>
              
              <motion.ul variants={staggerContainer} className="space-y-4">
                {[
                  { icon: <Code />, title: "Frontend", desc: "Built with Next.js 13 App Router for efficient, modern UI rendering and navigation" },
                  { icon: <Database />, title: "Backend", desc: "Powered by Flask with a robust API for plant identification, translation, and data management" },
                  { icon: <Brain />, title: "ML Model", desc: "Integrates a TensorFlow (Xception-based) model for accurate plant classification" },
                  { icon: <Shield />, title: "Security", desc: "User authentication and secure data storage to protect your identification history" }
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    variants={featureCardVariants}
                    className="flex items-start p-3 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                  >
                    <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-3xl mx-auto text-center mb-20"
          >
            <motion.h2 
              custom={0}
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400"
            >
              Key Features
            </motion.h2>
            <motion.p 
              custom={1}
              variants={fadeIn}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Our platform combines cutting-edge technology with comprehensive botanical information
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Microscope className="w-8 h-8" />,
                title: "Plant Identification",
                description: "Upload images of plants for accurate identification using our trained ML model with 80+ medicinal plant species"
              },
              {
                icon: <Languages className="w-8 h-8" />,
                title: "Multilingual Support",
                description: "Access plant information in 15+ languages including Hindi, Telugu, Tamil, and more regional languages"
              },
              {
                icon: <Volume2 className="w-8 h-8" />,
                title: "Text-to-Speech",
                description: "Listen to plant descriptions in your preferred language through our integrated audio playback"
              },
              {
                icon: <BarChart className="w-8 h-8" />,
                title: "Detailed Information",
                description: "Get comprehensive details including scientific name, family, medicinal uses, regions, and properties"
              },
              {
                icon: <User className="w-8 h-8" />,
                title: "User Profiles",
                description: "Create an account to save your identification history and access it across devices"
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Responsive Design",
                description: "Optimized for both desktop and mobile use with a beautiful, intuitive interface"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                whileHover="hover"
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-green-100/50 dark:bg-green-900/20 z-0 group-hover:scale-150 transition-transform duration-500 ease-out" />
                <div className="relative z-10">
                  <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-xl flex items-center justify-center text-green-600 mb-4 shadow-md group-hover:bg-green-600 group-hover:text-white transform transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Check className="mr-1 h-4 w-4" />
                    <span className="text-sm font-medium">Learn more</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              custom={0}
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Technical Implementation
            </motion.h2>
            <motion.p 
              custom={1}
              variants={fadeIn}
              className="text-lg text-gray-600 dark:text-gray-300"
            >
              Behind the beautiful interface lies a sophisticated technical architecture
            </motion.p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-4">Frontend Technologies</h3>
              <ul className="space-y-2">
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mr-3" />
                  <span>Next.js 13 with App Router architecture</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mr-3" />
                  <span>Tailwind CSS for responsive, modern UI</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mr-3" />
                  <span>Framer Motion for smooth animations</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-amber-500 mr-3" />
                  <span>TypeScript for type safety and better developer experience</span>
                </li>
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-4">Backend Technologies</h3>
              <ul className="space-y-2">
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500 mr-3" />
                  <span>Flask backend with RESTful API design</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500 mr-3" />
                  <span>TensorFlow for ML model implementation</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500 mr-3" />
                  <span>googletrans for multilingual support</span>
                </li>
                <li className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <Zap className="w-5 h-5 text-purple-500 mr-3" />
                  <span>gTTS (Google Text-to-Speech) for audio generation</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {}
      <WhoCanBenefit />
      
      {}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center p-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Start Exploring Medicinal Plants Today
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Identify plants, discover their medicinal properties, and contribute to the preservation of traditional botanical knowledge
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/identify'}
                className="px-8 py-3 bg-white text-green-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              >
                Identify a Plant
              </button>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 