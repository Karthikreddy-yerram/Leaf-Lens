"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Sparkles, MessageSquare, Send, Star, ThumbsUp, MessageCircle, AlertTriangle, Image as ImageIcon, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { AuthRoute } from "@/components/auth-route"

export default function FeedbackPage() {
  return (
    <AuthRoute>
      <FeedbackContent />
    </AuthRoute>
  )
}

function FeedbackContent() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [feedbackType, setFeedbackType] = useState("suggestion")
  const [feedbackText, setFeedbackText] = useState("")
  const [rating, setRating] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [screenshot, setScreenshot] = useState<File | null>(null)
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)
  
  const [hoveredRating, setHoveredRating] = useState<number>(0)

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setScreenshot(file)
      const url = URL.createObjectURL(file)
      setScreenshotPreview(url)
    }
  }

  const handleRemoveScreenshot = () => {
    setScreenshot(null)
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview)
      setScreenshotPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!feedbackText.trim()) {
      toast({
        title: "Feedback text is required",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (screenshot) {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("feedbackType", feedbackType)
        formData.append("feedbackText", feedbackText)
        formData.append("rating", rating.toString())
        formData.append("screenshot", screenshot)
        
        await axios.post("http://localhost:5000/submit_feedback", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
      } else {
        await axios.post("http://localhost:5000/submit_feedback", {
          name,
          email,
          feedbackType,
          feedbackText,
          rating
        })
      }
      
      setIsSuccess(true)
      
      setTimeout(() => {
        setName("")
        setEmail("")
        setFeedbackType("suggestion")
        setFeedbackText("")
        setRating(0)
        setScreenshot(null)
        if (screenshotPreview) {
          URL.revokeObjectURL(screenshotPreview)
          setScreenshotPreview(null)
        }
        setIsSuccess(false)
      }, 3000)
      
      toast({
        title: "Thank you for your feedback!",
        description: "We appreciate your input and will use it to improve our service."
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const feedbackTypeIcons = {
    suggestion: <Sparkles className="h-4 w-4" />,
    bug: <AlertTriangle className="h-4 w-4" />,
    compliment: <ThumbsUp className="h-4 w-4" />,
    other: <MessageCircle className="h-4 w-4" />
  }
  
  const ratingLabels = [
    "Poor",
    "Fair",
    "Good",
    "Very Good",
    "Excellent"
  ]
  
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <MessageSquare className="w-4 h-4 mr-2" />
          We Value Your Input
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Share Your Feedback
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Help us improve Leaf-Lens with your suggestions, report issues, or let us know what you love.
        </p>
      </motion.div>
      
      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-900/30"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
              >
                <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
            <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">Feedback Received!</h3>
            <p className="text-green-700 dark:text-green-300 text-center max-w-md">
              Thank you for helping us improve. Your feedback has been recorded and will be reviewed by our team.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span>Feedback Form</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name (Optional)</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Feedback Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(feedbackTypeIcons).map(([type, icon]) => (
                        <Button
                          key={type}
                          type="button"
                          variant={feedbackType === type ? "default" : "outline"}
                          className="flex-1 capitalize"
                          onClick={() => setFeedbackType(type)}
                        >
                          {icon}
                          <span className="ml-2">{type}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Your Feedback</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Please share your thoughts, suggestions, or issues you've encountered..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={5}
                      className="bg-background resize-none"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="screenshot" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      <span>Add Screenshot (Optional)</span>
                    </Label>
                    
                    {screenshotPreview ? (
                      <div className="relative rounded-md overflow-hidden border border-border">
                        <div className="relative h-48 w-full">
                          <Image 
                            src={screenshotPreview} 
                            alt="Screenshot preview" 
                            fill
                            className="object-contain"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative">
                        <Input
                          id="screenshot"
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="hidden"
                        />
                        <label 
                          htmlFor="screenshot" 
                          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-primary/70" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">Click to upload an image</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max. 5MB)</p>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Rate Your Experience</Label>
                    <div className="flex items-center justify-center sm:justify-start gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="focus:outline-none"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              (hoveredRating ? star <= hoveredRating : star <= rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            } transition-colors`}
                          />
                        </motion.button>
                      ))}
                      
                      {(rating > 0 || hoveredRating > 0) && (
                        <span className="ml-2 text-sm font-medium text-muted-foreground">
                          {ratingLabels[(hoveredRating || rating) - 1]}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner className="h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Feedback
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-16 text-center text-muted-foreground"
      >
        <p className="max-w-2xl mx-auto">
          We're constantly working to improve Leaf-Lens and your feedback is invaluable.
          Every suggestion helps us create a better experience for our community.
        </p>
      </motion.div>
    </div>
  )
} 