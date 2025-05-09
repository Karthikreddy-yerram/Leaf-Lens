"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { translateText } from "@/lib/translation"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"

const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "bn", label: "Bengali" },
  { code: "gu", label: "Gujarati" },
  { code: "pa", label: "Punjabi" },
]

type PlantHistory = {
  id: string
  userId: string
  plantName: string
  confidence: number
  imageUrl: string
  timestamp: string
  info?: PlantInfo
  tts?: string
}

type PlantInfo = {
  [key: string]: any
}

export default function ResultPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [plantHistory, setPlantHistory] = useState<PlantHistory | null>(null)
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [originalInfo, setOriginalInfo] = useState<PlantInfo | null>(null)
  const [translatedInfo, setTranslatedInfo] = useState<PlantInfo | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState("en")
  const [loading, setLoading] = useState(true)
  const [audioLoading, setAudioLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const resultRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const loadPlantInfo = async () => {
      try {
        const local = JSON.parse(localStorage.getItem("plantHistory") || "[]")
        const plantItem = local.find((item: PlantHistory) => item.id === id)

        if (!plantItem) {
          toast({
            title: "Plant not found",
            description: "This plant doesn't exist in your history.",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setPlantHistory(plantItem)
        
        if (plantItem.info) {
          if (currentLanguage === "en") {
            setPlantInfo(plantItem.info)
            setOriginalInfo(plantItem.info)
          } else {
            setPlantInfo(plantItem.info)
            
            try {
              const email = localStorage.getItem('email') || ''
              const password = localStorage.getItem('password') || ''
              
              const res = await fetch(`http://localhost:5000/get_original_plant_info`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  email, 
                  password,
                  plant_name: plantItem.plantName 
                })
              })
              
              if (res.ok) {
                const data = await res.json()
                setOriginalInfo(data) 
              } else {
                setOriginalInfo(plantItem.info)
              }
            } catch (error) {
              console.error("Failed to get original info:", error)
              setOriginalInfo(plantItem.info)
            }
          }
        }

        const savedLang = localStorage.getItem("preferredLanguage") || "en"
        setCurrentLanguage(savedLang)

        if (savedLang !== "en") {
          handleTranslate(savedLang)
        }

        setLoading(false)
      } catch (error) {
        console.error("Failed to load plant info:", error)
        toast({
          title: "Error loading plant",
          description: "Could not load plant information.",
          variant: "destructive",
        })
        router.push("/dashboard")
      }
    }

    loadPlantInfo()
  }, [id, router, user, toast])

  const handleTranslate = async (lang: string) => {
    if (!originalInfo) return

    try {
      const translated = await translateText(originalInfo, lang)
      setTranslatedInfo(translated)
      setCurrentLanguage(lang)
      localStorage.setItem("preferredLanguage", lang)
      setAudioUrl(null)

      updateHistoryField("info", translated)
      await handleSaveToHistory(translated)
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Could not translate plant info.",
        variant: "destructive",
      })
    }
  }

  const handleTextToSpeech = async () => {
    const data = currentLanguage === "en" ? plantInfo : translatedInfo
    if (!data) return

    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
      return
    }

    try {
      setAudioLoading(true)
      const res = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: currentLanguage, info: data }),
      })

      const { audioBase64 } = await res.json()
      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`)
      audio.volume = 1
      audio.playbackRate = 1
      audio.onended = () => setIsPlaying(false)

      audioRef.current = audio
      setAudioUrl(audio.src)
      audio.play()
      setIsPlaying(true)

      updateHistoryField("tts", audioBase64)
      await handleSaveToHistory(undefined, audioBase64)
    } catch (error) {
      toast({
        title: "TTS Error",
        description: "Failed to generate audio.",
        variant: "destructive",
      })
    } finally {
      setAudioLoading(false)
    }
  }

  const handleSaveToHistory = async (infoOverride?: PlantInfo, audioBase64Override?: string) => {
    if (!plantHistory || !user) return

    const email = localStorage.getItem("email") || ""
    const password = localStorage.getItem("password") || ""
    const infoData = infoOverride || (currentLanguage === "en" ? plantInfo : translatedInfo)
    const ttsData = audioBase64Override || audioUrl?.split(",")[1] || ""

    if (!infoData) return

    const entry = {
      id: plantHistory.id,
      plantName: plantHistory.plantName,
      confidence: plantHistory.confidence,
      imageUrl: plantHistory.imageUrl,
      timestamp: new Date().toISOString(),
      info: infoData,
      tts: ttsData,
      userId: user.id,
    }

    try {
      const local = JSON.parse(localStorage.getItem("plantHistory") || "[]")
      
      const filtered = local.filter((item: PlantHistory) => 
        item.id !== entry.id && item.plantName !== entry.plantName
      )
      
      filtered.unshift(entry)
      localStorage.setItem("plantHistory", JSON.stringify(filtered))

      const response = await fetch("http://localhost:5000/save_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, plant_data: entry }),
      })

      if (response.ok) {
        toast({ title: "✅ Saved to history!" })
      } else {
        toast({ 
          title: "Error saving to history", 
          description: "Could not save to server", 
          variant: "destructive" 
        })
      }
    } catch (error) {
      console.error("Failed to save history:", error)
      toast({ 
        title: "Error saving to history", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      })
    }
  }

  const updateHistoryField = (key: "info" | "tts", value: any) => {
    const history = JSON.parse(localStorage.getItem("plantHistory") || "[]")
    const updated = history.map((entry: PlantHistory) =>
      entry.id === id ? { ...entry, [key]: value } : entry
    )
    localStorage.setItem("plantHistory", JSON.stringify(updated))
  }

  const displayInfo = currentLanguage === "en" ? plantInfo : translatedInfo

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [displayInfo])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
        <Header />
        <LoadingSpinner size="lg" text="Loading plant information..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <Header />
      <div className="container max-w-4xl space-y-6" ref={resultRef}>
        <div>
          <label className="block mb-2 font-medium">🌍 Select Language</label>
          <select
            value={currentLanguage}
            onChange={(e) => handleTranslate(e.target.value)}
            className="border p-2 rounded"
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {displayInfo && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🌿 {plantHistory?.plantName}</h2>
            {Object.entries(displayInfo).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong>{" "}
                {Array.isArray(value) ? (
                  value.join(", ")
                ) : typeof value === "object" && value !== null ? (
                  <ul className="list-disc ml-6">
                    {Object.entries(value as Record<string, any>).map(([k, v]) => (
                      <li key={k}>
                        <strong>{k}:</strong> {String(v)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  String(value)
                )}
              </div>
            ))}
            <div className="flex gap-4 mt-4 flex-wrap">
              <Button onClick={handleTextToSpeech} disabled={audioLoading}>
                {isPlaying ? "⏹️ Stop Audio" : "🔊 Play Info"}
              </Button>
              <Button onClick={() => handleSaveToHistory()} variant="outline">
                💾 Save to History
              </Button>
              {audioUrl && <audio src={audioUrl} autoPlay hidden />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
