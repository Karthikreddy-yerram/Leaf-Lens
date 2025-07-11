"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="inline-flex items-center justify-center">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`relative flex h-7 w-7 items-center justify-center rounded-full border ${
          theme === "dark" 
            ? "bg-[#1a365d] border-blue-700" 
            : "bg-yellow-400 border-yellow-500"
        } transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-400`}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg className="h-3.5 w-3.5 text-blue-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5 text-yellow-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
      </button>
    </div>
  )
}
