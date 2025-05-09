import { HomeHero } from "@/components/home-hero"
import { Features } from "@/components/features"
import { PlantQuotes } from "@/components/plant-quotes"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {}
      <div className="relative z-10">
        <Header />
        <HomeHero />
        <PlantQuotes />
        <Features />
        <Footer />
      </div>
    </main>
  )
}
