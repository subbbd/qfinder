import Hero from '../components/landing/Hero'
import HowItWorks from '../components/landing/HowItWorks'
import Features from '../components/landing/Features'
import CallToAction from '../components/landing/CallToAction'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <CallToAction />

      {/* Footer */}
      <footer className="bg-brand-black border-t border-white/10 py-8 px-4 text-center">
        <p className="text-white/30 text-sm">
          © 2026 Qfinder · Free · Community-powered · Built for everyone
        </p>
      </footer>
    </main>
  )
}
