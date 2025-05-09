'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Leaf, Upload, Trash2, Volume2, Languages, Sparkles, ImageIcon, Info, X, Download } from 'lucide-react'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AudioPlayer } from '@/components/audio-player'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

interface PlantInfo {
  [key: string]: any
}

interface PlantData {
  id?: string
  plantName: string
  confidence: number
  info: PlantInfo
  tts?: string
  imageUrl?: string
  timestamp?: string
}


const languages: Record<string, string> = {
  en: '🇬🇧 English',
  hi: '🇮🇳 Hindi',
  te: '🇮🇳 Telugu',
  ta: '🇮🇳 Tamil',
  kn: '🇮🇳 Kannada',
  ml: '🇮🇳 Malayalam',
  bn: '🇮🇳 Bengali',
  gu: '🇮🇳 Gujarati',
  mr: '🇮🇳 Marathi',
  ur: '🇵🇰 Urdu',
  fr: '🇫🇷 French',
  es: '🇪🇸 Spanish',
  de: '🇩🇪 German',
  'zh-cn': '🇨🇳 Chinese',
  ja: '🇯🇵 Japanese',
}

export default function IdentifyPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [plantData, setPlantData] = useState<PlantData | null>(null)
  const [originalInfo, setOriginalInfo] = useState<PlantInfo | null>(null)
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [audioBase64, setAudioBase64] = useState<string>('')
  const [translating, setTranslating] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      setPlantData(null)
      setAudioBase64('')
    }
  }

  const handleUpload = async () => {
    if (!imageFile) return
    setLoading(true)

    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('language', language)

    try {
      const res = await axios.post('http://localhost:5000/identify', formData)
      const data: PlantData = {
        ...res.data,
        imageUrl: res.data.imageUrl || '',
        timestamp: new Date().toISOString()
      }
      
      if (language === 'en') {
        setOriginalInfo(data.info)
      } else {
        try {
          const englishRes = await axios.post('http://localhost:5000/identify', {
            image: imageFile,
            language: 'en'
          })
          setOriginalInfo(englishRes.data.info)
        } catch (err) {
          console.error('Failed to get English data:', err)
          setOriginalInfo(data.info)
        }
      }
      
      setPlantData(data)
      setAudioBase64(`data:audio/mp3;base64,${data.tts || ''}`)
      await saveToHistory(data)
    } catch (error) {
      console.error('Identification failed:', error)
      alert('Failed to connect to the server. Please ensure the backend server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async () => {
    if (!plantData || !originalInfo) return
    setTranslating(true)

    try {
      const res = await axios.post('http://localhost:5000/translate', {
        content: originalInfo,
        language,
      })

      const translatedInfo = res.data
      const updated = { 
        ...plantData, 
        info: translatedInfo,
        timestamp: new Date().toISOString()
      }
      setPlantData(updated)
      setAudioBase64('')
      await saveToHistory(updated)
    } catch (error) {
      console.error('Translation failed:', error)
    } finally {
      setTranslating(false)
    }
  }

  const handleTTS = async () => {
    if (!plantData?.info) return
    setSpeaking(true)

    try {
      const res = await axios.post('http://localhost:5000/tts', {
        info: plantData.info,
        language,
      })

      if (res.data.audioBase64) {
        const audioSrc = `data:audio/mp3;base64,${res.data.audioBase64}`
        setAudioBase64(audioSrc)
        const updated = { ...plantData, tts: res.data.audioBase64 }
        await saveToHistory(updated)
      }
    } catch (error) {
      console.error('TTS failed:', error)
    } finally {
      setSpeaking(false)
    }
  }

  const handleDownloadReport = async (format: 'pdf' | 'txt' | 'json' | 'html') => {
    if (!plantData) return
    
    setDownloading(true)
    
    try {
      const reportData = {
        plantName: plantData.plantName,
        confidence: plantData.confidence,
        language: languages[language],
        timestamp: new Date().toLocaleString(),
        information: plantData.info
      }
      
      if (format === 'json') {
        const jsonString = JSON.stringify(reportData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${plantData.plantName.toLowerCase().replace(/\s+/g, '-')}_report.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (format === 'txt') {
        let textContent = `Plant: ${plantData.plantName}\n`
        textContent += `Confidence: ${(plantData.confidence * 100).toFixed(2)}%\n`
        textContent += `Language: ${languages[language]}\n`
        textContent += `Date: ${new Date().toLocaleString()}\n\n`
        textContent += `PLANT INFORMATION:\n`
        textContent += `==================\n\n`
        
        Object.entries(plantData.info).forEach(([key, value]) => {
          textContent += `${key.replace(/_/g, ' ').toUpperCase()}:\n`
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              textContent += value.join(', ')
            } else {
              textContent += Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')
            }
          } else {
            textContent += value
          }
          textContent += '\n\n'
        })
        
        textContent += `Generated by Leaf-Lens\n`
        textContent += `https://leaf-lens.com\n`
        
        const blob = new Blob([textContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${plantData.plantName.toLowerCase().replace(/\s+/g, '-')}_report.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (format === 'html') {
        let htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${plantData.plantName} Report | Leaf-Lens</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .report-header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eaeaea;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #16a34a;
                margin-bottom: 10px;
              }
              .plant-name {
                font-size: 32px;
                margin: 10px 0;
                color: #16a34a;
              }
              .meta-info {
                font-size: 14px;
                color: #666;
                margin-bottom: 20px;
              }
              .confidence {
                display: inline-block;
                background: #e6f7ef;
                color: #16a34a;
                padding: 4px 12px;
                border-radius: 20px;
                font-weight: 500;
                margin-bottom: 20px;
              }
              .plant-image {
                width: 100%;
                max-width: 400px;
                margin: 0 auto 30px;
                display: block;
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .info-section {
                margin-bottom: 40px;
              }
              h2 {
                color: #16a34a;
                font-size: 24px;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 2px solid #e6f7ef;
              }
              .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
              }
              .info-card {
                background: #f9f9f9;
                border-radius: 8px;
                padding: 16px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.05);
              }
              .info-card h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: #16a34a;
                font-size: 18px;
                text-transform: capitalize;
              }
              .info-card p {
                margin: 0;
                color: #555;
              }
              footer {
                text-align: center;
                margin-top: 40px;
                font-size: 12px;
                color: #888;
              }
            </style>
          </head>
          <body>
            <div class="report-header">
              <div class="logo">Leaf-Lens</div>
              <h1 class="plant-name">${plantData.plantName}</h1>
              <div class="meta-info">
                Generated on ${new Date().toLocaleString()} | Language: ${languages[language]}
              </div>
              <div class="confidence">Confidence: ${(plantData.confidence * 100).toFixed(2)}%</div>
            </div>

            ${plantData.imageUrl ? `<img src="${plantData.imageUrl}" alt="${plantData.plantName}" class="plant-image">` : ''}

            <div class="info-section">
              <h2>Plant Information</h2>
              <div class="info-grid">
        `

        Object.entries(plantData.info).forEach(([key, value]) => {
          htmlContent += `<div class="info-card">
            <h3>${key.replace(/_/g, ' ')}</h3>
            <p>`

          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              htmlContent += value.join(', ')
            } else {
              htmlContent += Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')
            }
          } else {
            htmlContent += value
          }

          htmlContent += `</p>
          </div>`
        })

        htmlContent += `
              </div>
            </div>

            <footer>
              Generated by Leaf-Lens | Medicinal Plant Identification System<br>
              &copy; ${new Date().getFullYear()} Leaf-Lens. All rights reserved.
            </footer>
          </body>
          </html>
        `

        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${plantData.plantName.toLowerCase().replace(/\s+/g, '-')}_report.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        alert("PDF generation would require a PDF library. For this demo, try the HTML report for a formatted version.")
      }
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setDownloading(false)
    }
  }

  const saveToHistory = async (data: PlantData) => {
    const id = data?.id || uuidv4()
    
    const entry = {
      id,
      plantName: data.plantName,
      confidence: data.confidence,
      imageUrl: data.imageUrl,
      timestamp: data.timestamp || new Date().toISOString(),
      info: data.info,
      tts: data.tts || '',
      userId: localStorage.getItem('userId') || 'guest',
    }

    try {
      const email = localStorage.getItem('email') || ''
      const password = localStorage.getItem('password') || ''
      
      const response = await axios.post('http://localhost:5000/save_history', {
        email,
        password,
        plant_data: entry,
      })
      
      if (response.data.success) {
        console.log('History saved successfully')
      } else {
        console.error('Error saving history:', response.data.message)
      }
    } catch (err) {
      console.error('Error syncing history:', err)
    }
  }

  const handleClearHistory = async () => {
    try {
      const email = localStorage.getItem('email') || ''
      const password = localStorage.getItem('password') || ''
      await axios.post('http://localhost:5000/clear_history', {
        email,
        password,
      })
      alert('History cleared successfully!')
    } catch (error) {
      console.error('Failed to clear history:', error)
      alert('Failed to clear history')
    }
  }

  useEffect(() => {
    if (plantData && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [plantData])

  useEffect(() => {
    const loadHistoryItem = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const entryId = urlParams.get('id');
      
      if (!entryId) return;
      
      try {
        const email = localStorage.getItem('email');
        const password = localStorage.getItem('password');
        
        if (!email || !password) {
          router.push('/login');
          return;
        }
        
        const historyRes = await axios.post('http://localhost:5000/get_history', {
          email,
          password,
        });
        
        const entry = historyRes.data.find((item: any) => item.id === entryId);
        
        if (!entry) {
          console.error('Entry not found');
          return;
        }
        
        if (entry.imageUrl) {
          setPreviewUrl(entry.imageUrl);
          
          const imgResponse = await fetch(entry.imageUrl);
          const blob = await imgResponse.blob();
          const fileName = entry.imageUrl.split('/').pop() || 'image.jpg';
          const file = new File([blob], fileName, { type: blob.type });
          
          setImageFile(file);
          
          const formData = new FormData();
          formData.append('image', file);
          formData.append('language', language);
          
          setLoading(true);
          
          const res = await axios.post('http://localhost:5000/identify', formData);
          const data: PlantData = {
            ...res.data,
            imageUrl: res.data.imageUrl || '',
            timestamp: new Date().toISOString()
          };
          
          if (language === 'en') {
            setOriginalInfo(data.info);
          } else {
            setOriginalInfo(data.info);
          }
          
          setPlantData(data);
          setAudioBase64(`data:audio/mp3;base64,${data.tts || ''}`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading history item:', error);
        setLoading(false);
      }
    };
    
    loadHistoryItem();
  }, [router]);

  return (
    <div className="container mx-auto py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            Identify Medicinal Plants
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload an image of a plant and our ML model will identify it and provide detailed information.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 shadow-lg h-full glass">
            <CardContent className="p-0">
              <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
                <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Plant Image
                </h2>

                <div 
                  className="mt-6 border-2 border-dashed border-primary/40 rounded-xl p-8 text-center cursor-pointer hover:border-primary/70 transition-colors duration-300 bg-background/5 backdrop-blur-sm group"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  
                  {previewUrl ? (
                    <div className="relative mx-auto rounded-lg overflow-hidden aspect-square max-w-xs border shadow-md hover-lift">
        <Image
          src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full opacity-90 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewUrl(null)
                          setImageFile(null)
                          setPlantData(null)
                          setAudioBase64('')
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-primary/15 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/25 transition-colors duration-300">
                        <ImageIcon className="h-10 w-10 text-primary/70" />
                      </div>
                      <p className="text-base text-foreground font-medium">
                        Drag and drop an image here or click to browse
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Supports JPG, PNG, WEBP (Max size: 5MB)
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
          onClick={handleUpload}
          disabled={!imageFile || loading}
                    className="button-modern relative overflow-hidden group flex-1"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner className="mr-2" /> 
                        Processing...
                      </>
                    ) : (
                      <>
                        <Leaf className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" /> 
                        Identify Plant
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-6">
                  <div className="text-sm text-muted-foreground">
                    <h3 className="font-medium mb-2 flex items-center gap-1">
                      <Languages className="h-4 w-4" /> Language for Results
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(languages).map(([code, name]) => (
                        <motion.button
                          key={code}
                          onClick={() => setLanguage(code)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className={`text-xs py-1.5 px-2 rounded-lg transition-all border ${
                            language === code 
                              ? 'bg-primary/15 border-primary/40 text-primary font-medium shadow-sm' 
                              : 'hover:bg-primary/5 border-border hover:border-primary/30'
                          }`}
                        >
                          {name}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          ref={resultRef}
          className="relative"
        >
          <AnimatePresence mode="wait">
            {plantData ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-2 shadow-lg h-full glass">
                  <CardContent className="p-0">
                    <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 group">
                            <Sparkles className="h-5 w-5 text-primary transition-all group-hover:rotate-12 duration-300" />
                            <span className="relative">
                              {plantData.plantName}
                              <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                            </span>
                          </h2>
                          <p className="text-muted-foreground mt-1">
                            Confidence: <span className="font-medium text-foreground">{(plantData.confidence * 100).toFixed(2)}%</span>
                          </p>
      </div>

                        <div className="flex gap-2">
                          {language !== 'en' && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
              onClick={handleTranslate}
                                disabled={translating}
                                className="border-primary/30 hover:bg-primary/5"
            >
                                {translating ? (
                                  <LoadingSpinner className="mr-2 h-3 w-3" />
                                ) : (
                                  <Languages className="mr-2 h-3 w-3" />
                                )}
              Translate
                              </Button>
                            </motion.div>
                          )}

                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              size="sm"
              onClick={handleTTS}
                              disabled={speaking || !plantData.info}
                              className="border-primary/30 hover:bg-primary/5"
                            >
                              {speaking ? (
                                <LoadingSpinner className="mr-2 h-3 w-3" />
                              ) : (
                                <Volume2 className="mr-2 h-3 w-3" />
                              )}
                              Speak
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={downloading}
                                  className="border-primary/30 hover:bg-primary/5"
                                >
                                  {downloading ? (
                                    <LoadingSpinner className="mr-2 h-3 w-3" />
                                  ) : (
                                    <Download className="mr-2 h-3 w-3" />
                                  )}
                                  Export
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDownloadReport('txt')}>
                                  Text Report (.txt)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadReport('json')}>
                                  JSON Data (.json)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownloadReport('html')}>
                                  HTML Report (.html)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </motion.div>
                        </div>
          </div>

          {audioBase64 && (
                        <div className="mb-4">
                          <AudioPlayer 
                            audioSrc={audioBase64}
                            plantName={plantData.plantName}
                            autoPlay={true}
                            plantInfo={plantData.info}
                            onDownload={() => {
                              const link = document.createElement('a')
                              link.href = audioBase64
                              link.download = `${plantData.plantName || 'plant-description'}.mp3`
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            }}
                          />
                        </div>
                      )}

                      <div className="rounded-xl border bg-background/60 backdrop-blur-md p-4 overflow-y-auto max-h-[400px] shadow-inner">
                        <div className="grid sm:grid-cols-2 gap-6">
            {Object.entries(plantData.info).map(([key, value], index) => (
                            <motion.div 
                              key={index} 
                              className="space-y-2 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <h3 className="text-sm font-semibold capitalize text-primary flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
                                {key.replace(/_/g, ' ')}
                              </h3>
                              {value === null ? (
                                <p className="text-sm text-muted-foreground">No information available</p>
                              ) : typeof value === "string" ? (
                                <p className="text-sm text-foreground leading-relaxed">{value}</p>
                              ) : Array.isArray(value) ? (
                                <ul className="list-disc pl-5 text-sm space-y-1 text-foreground leading-relaxed">
                                  {value.map((item, i) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                              ) : typeof value === "object" ? (
                                <ul className="list-disc pl-5 text-sm space-y-1 text-foreground leading-relaxed">
                                  {Object.entries(value).map(([subKey, subValue], i) => (
                                    <li key={i}>
                                      <span className="font-medium">{subKey}:</span> {String(subValue)}
                        </li>
                      ))}
                    </ul>
                              ) : (
                                <p className="text-sm text-foreground leading-relaxed">{String(value)}</p>
                              )}
                            </motion.div>
            ))}
          </div>
        </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <Card className="h-full border-2 border-dashed bg-primary/5 glass flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 floating">
                    <Leaf className="h-10 w-10 text-primary/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Plant Information</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Upload an image and identify a plant to see detailed information about its medicinal properties.
                  </p>
                  
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <div className="flex flex-col items-center w-24 p-3 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                        <span className="text-primary font-semibold text-sm">1</span>
                      </div>
                      <span className="text-xs text-center text-muted-foreground">Upload Image</span>
                    </div>
                    
                    <div className="flex flex-col items-center w-24 p-3 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                        <span className="text-primary font-semibold text-sm">2</span>
                      </div>
                      <span className="text-xs text-center text-muted-foreground">Identify</span>
                    </div>
                    
                    <div className="flex flex-col items-center w-24 p-3 rounded-lg bg-background/40 backdrop-blur-sm">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                        <span className="text-primary font-semibold text-sm">3</span>
                      </div>
                      <span className="text-xs text-center text-muted-foreground">Get Results</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
