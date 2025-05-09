"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

const quotes = [
  {
    quote:
      "The art of healing comes from nature, not from the physician. Therefore the physician must start from nature, with an open mind.",
    author: "Paracelsus",
  },
  {
    quote: "Nature itself is the best physician.",
    author: "Hippocrates",
  },
  {
    quote: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates",
  },
  {
    quote: "The plant world is a treasure trove of potential medicines and health-promoting substances.",
    author: "Norman R. Farnsworth",
  },
  {
    quote: "Medicinal plants, as gifts of nature, have been used since ancient times for their healing properties.",
    author: "Traditional Wisdom",
  },
]

export function PlantQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-16 relative overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5 dark:from-primary/10 dark:via-background dark:to-primary/10"></div>

      {}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Card className="border-none bg-transparent shadow-none">
            <CardContent className="pt-6 text-center min-h-[200px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuote}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <motion.div
                    className="text-5xl text-primary"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  >
                    "
                  </motion.div>
                  <p className="text-xl md:text-2xl font-serif italic px-4">{quotes[currentQuote].quote}</p>
                  <p className="text-sm text-muted-foreground">— {quotes[currentQuote].author}</p>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
