
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { Header } from "@/components/header"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Leaf-Lens | Medicinal Plant Identification",
  description: "Identify medicinal plants and learn about their properties",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            {}
            <div className="fixed inset-0 z-[-2] bg-background"></div>
            
            {}
            <div className="fixed inset-0 z-[-1] bg-grid-pattern opacity-30 dark:opacity-15 pointer-events-none"></div>
            
            {}
            <div className="fixed top-0 left-0 right-0 z-[-1] h-[40vh] w-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[35%] h-[60vh] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute -top-[15%] left-[30%] w-[35%] h-[50vh] rounded-full bg-green-300/10 dark:bg-green-700/5 blur-3xl animate-blob animation-delay-4000"></div>
              <div className="absolute -top-[10%] right-[10%] w-[30%] h-[40vh] rounded-full bg-emerald-400/10 dark:bg-emerald-800/10 blur-3xl animate-blob animation-delay-6000"></div>
            </div>
            
            {}
            <div className="fixed bottom-0 left-0 right-0 z-[-1] h-[30vh] w-full overflow-hidden pointer-events-none">
              <div className="absolute bottom-[10%] left-[5%] w-[25%] h-[30vh] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl animate-blob-slow"></div>
              <div className="absolute bottom-[-5%] right-[15%] w-[25%] h-[30vh] rounded-full bg-emerald-300/10 dark:bg-emerald-700/5 blur-3xl animate-blob-slow animation-delay-2000"></div>
            </div>
            
            {}
            <div className="fixed inset-0 z-[-1] opacity-20 dark:opacity-40 bg-noise pointer-events-none"></div>
            
            {}
            <Header />

            {}
            <main className="pt-20 px-4 min-h-screen max-w-[1920px] mx-auto relative">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-[-1] rounded-xl"></div>
              {children}
            </main>

            {}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-[-1] pointer-events-none"></div>

            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
