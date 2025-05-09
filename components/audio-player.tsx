'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Download,
  RotateCcw, 
  RotateCw,
  Settings,
  FileText,
  FileJson,
  FileAudio,
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"

interface AudioPlayerProps {
  audioSrc: string
  plantName?: string
  autoPlay?: boolean
  onDownload?: () => void
  plantInfo?: Record<string, any>
}

export function AudioPlayer({ audioSrc, plantName, autoPlay = false, onDownload, plantInfo }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [barHeights, setBarHeights] = useState<number[]>([])
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    const generateRandomBarHeights = () => {
      const numBars = 40
      const heights = []
      
      for (let i = 0; i < numBars; i++) {
        const middlePoint = numBars / 2
        const distanceFromMiddle = Math.abs(i - middlePoint)
        const baseHeight = Math.max(20, 70 - distanceFromMiddle * 1.5)
        
        const randomOffset = Math.random() * 20 - 10
        const height = Math.min(100, Math.max(15, baseHeight + randomOffset))
        
        heights.push(height)
      }
      
      return heights
    }
    
    setBarHeights(generateRandomBarHeights())
  }, [audioSrc])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    if (autoPlay) {
      audio.play().catch(error => console.error('Auto play failed:', error))
      setIsPlaying(true)
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [autoPlay])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0]
      audioRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted
      audioRef.current.muted = newMutedState
      setIsMuted(newMutedState)
    }
  }

  const handleDownloadAudio = () => {
    if (onDownload) {
      onDownload()
    } else {
      const link = document.createElement('a')
      link.href = audioSrc
      link.download = `${plantName || 'plant-description'}-audio.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadTranscript = () => {
    if (!plantInfo) return
    
    setDownloading(true)
    
    try {
      let textContent = `AUDIO TRANSCRIPT: ${plantName || 'Plant Description'}\n`
      textContent += `Timestamp: ${new Date().toLocaleString()}\n\n`
      
      Object.entries(plantInfo).forEach(([key, value]) => {
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
      
      const blob = new Blob([textContent], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${plantName?.toLowerCase().replace(/\s+/g, '-') || 'plant'}-transcript.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating transcript:', error)
    } finally {
      setDownloading(false)
    }
  }

  const setSpeed = (speed: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed
      setPlaybackRate(speed)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      const newTime = Math.min(audioRef.current.duration, currentTime + 5)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      const newTime = Math.max(0, currentTime - 5)
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-background/70 backdrop-blur-sm p-4 shadow-sm">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      
      {}
      {plantName && (
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <h3 className="text-sm font-medium text-foreground flex items-center">
              {plantName}
              <span className="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary">Audio</span>
            </h3>
          </div>
          <div className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </div>
        </div>
      )}

      {}
      <div className="h-12 flex items-center justify-center mb-2 relative">
        <div className="absolute inset-0 flex items-center justify-center gap-[2px]">
          {barHeights.map((height, i) => {
            const isActive = i / barHeights.length < (currentTime / duration || 0)
            return (
              <div 
                key={i} 
                className={`w-1 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-primary' : 'bg-muted-foreground/30'
                }`}
                style={{ 
                  height: `${height}%`,
                  transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.7)'
                }}
              />
            )
          })}
        </div>
      </div>

      {}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || 100}
          step={0.01}
          className="mx-2 flex-1"
          onValueChange={handleSeek}
        />
        <span>-{formatTime(Math.max(0, duration - currentTime))}</span>
      </div>
      
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:text-primary"
            onClick={skipBackward}
            title="Skip backward 5 seconds"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon" 
            variant="default" 
            className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90"
            onClick={togglePlay}
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div
                  key="pause"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Pause className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Play className="h-5 w-5 ml-0.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 rounded-full hover:text-primary"
            onClick={skipForward}
            title="Skip forward 5 seconds"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          {}
          <div className="relative" onMouseEnter={() => setShowVolumeControl(true)} onMouseLeave={() => setShowVolumeControl(false)}>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full"
              onClick={toggleMute}
              title="Volume"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <AnimatePresence>
              {showVolumeControl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-background border border-border rounded-lg p-2 shadow-md w-32 z-10"
                >
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    className="w-full"
                    onValueChange={handleVolumeChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full"
                title="Playback speed"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                <DropdownMenuItem 
                  key={speed} 
                  onClick={() => setSpeed(speed)}
                  className={playbackRate === speed ? "bg-primary/10 text-primary" : ""}
                >
                  {speed}x {playbackRate === speed && "✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full"
                disabled={downloading}
                title="Download options"
              >
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Download Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadAudio} className="flex items-center gap-2">
                <FileAudio className="h-4 w-4" />
                <span>Audio File (.mp3)</span>
              </DropdownMenuItem>
              
              {plantInfo && (
                <DropdownMenuItem onClick={handleDownloadTranscript} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Text Transcript (.txt)</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
} 