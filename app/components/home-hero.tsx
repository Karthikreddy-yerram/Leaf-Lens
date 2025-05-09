import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Leaf, Camera, Globe2, Volume2, History } from "lucide-react"

export function HomeHero() {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {}
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="sm:text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium"
              >
                <Leaf className="w-4 h-4 mr-2" />
                ML-Based Plant Identification
              </motion.div>

              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Discover the Power of</span>
                <span className="block text-green-600">Medicinal Plants</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Unlock nature's healing potential with our ML-based plant identification system. Learn about traditional medicinal properties in your preferred language.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button
                    onClick={() => router.push('/identify')}
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Identify Plant
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 md:py-4 md:text-lg md:px-10"
                  >
                    <History className="w-5 h-5 mr-2" />
                    View History
                  </Button>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-16 bg-white dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">About Our Platform</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Advanced Plant Recognition Technology
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              Our platform combines cutting-edge machine learning with traditional knowledge to help you identify and learn about medicinal plants.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-500 text-white mb-4">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ML-Based Recognition</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  State-of-the-art deep learning model trained on over 80 medicinal plant species with 99% accuracy.
                </p>
              </motion.div>

              {}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-500 text-white mb-4">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multilingual Support</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access plant information in 15+ languages including Hindi, Telugu, Tamil, and more regional languages.
                </p>
              </motion.div>

              {}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-green-500 text-white mb-4">
                  <Volume2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Audio Descriptions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Listen to detailed plant information with our text-to-speech feature in multiple languages.
                </p>
              </motion.div>
            </div>

            <div className="mt-12 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                onClick={() => router.push('/identify')}
              >
                <Leaf className="w-5 h-5 mr-2" />
                Start Identifying Plants
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
} 