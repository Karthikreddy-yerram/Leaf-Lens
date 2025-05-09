"use client"

import { motion } from "framer-motion"
import { BookOpen, Users, Microscope, Leaf, Home, FlaskConical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface BeneficiaryGroupProps {
  title: string
  description: string
  icon: React.ElementType
  index: number
  color: string
}

const BeneficiaryGroup = ({ title, description, icon: Icon, index, color }: BeneficiaryGroupProps) => {
  const IconComponent = Icon || Leaf;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="h-full bg-white dark:bg-gray-800/60 backdrop-blur-sm border-2 border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl group">
        <CardContent className="p-6">
          <div className="flex flex-col h-full">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300 shadow-md`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            
            <p className="text-muted-foreground">{description}</p>
            
            <motion.div 
              className={`h-0.5 w-0 mt-3 rounded-full ${color.replace('bg-', 'bg-gradient-to-r from-')}`}
              initial={{ width: 0 }}
              whileInView={{ width: "40%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function WhoCanBenefit() {
  const beneficiaries = [
    {
      title: "Educational Institutions",
      description: "Teachers and students studying botany, pharmacology, and traditional medicine",
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Healthcare Professionals",
      description: "Doctors, pharmacists, and practitioners of traditional medicine systems",
      icon: Users,
      color: "bg-emerald-500"
    },
    {
      title: "Researchers",
      description: "Botanists and medicinal plant researchers documenting and studying plants",
      icon: Microscope,
      color: "bg-purple-500"
    },
    {
      title: "Conservation Groups",
      description: "Organizations working to document and preserve medicinal plant biodiversity",
      icon: Leaf,
      color: "bg-green-500"
    },
    {
      title: "Home Gardeners",
      description: "Enthusiasts growing medicinal plants and wanting to identify species",
      icon: Home,
      color: "bg-amber-500"
    },
    {
      title: "Herbal Practitioners",
      description: "Professionals working with herbal remedies and traditional healing",
      icon: FlaskConical,
      color: "bg-pink-500"
    }
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {}
      <div className="absolute inset-0 -z-10 bg-gray-50 dark:bg-gray-900/50">
        <motion.div 
          className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        
        {}
        <motion.div 
          className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        />
      </div>

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Who Can Benefit
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Leaf-Lens is designed for a wide range of users with interest in medicinal plants
          </motion.p>
          
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-primary to-green-600 rounded-full mx-auto mt-6"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 80, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {beneficiaries.map((beneficiary, index) => (
            <BeneficiaryGroup 
              key={index}
              title={beneficiary.title}
              description={beneficiary.description}
              icon={beneficiary.icon}
              index={index}
              color={beneficiary.color}
            />
          ))}
        </div>
      </div>

      {}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-16 w-16 rounded-full bg-primary/5"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </section>
  )
} 