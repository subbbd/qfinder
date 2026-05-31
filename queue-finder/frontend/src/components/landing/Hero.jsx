import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-black px-4">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-brand-red/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Tag line chip */}
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="text-brand-orange text-sm font-medium">Live crowd data, powered by you</span>
        </div>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
          Know before
          <br />
          <span className="text-brand-orange">you go.</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Check crowd levels and item availability at nearby pharmacies, grocery stores, and more — before you leave home.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/explore"
            className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-8 py-4 rounded-xl text-base transition-all min-w-[200px] text-center shadow-lg shadow-brand-orange/20"
          >
            Find Stores Near Me
          </Link>
          <a
            href="#how-it-works"
            className="border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all min-w-[200px] text-center"
          >
            How It Works
          </a>
        </div>

        {/* Trust line */}
        <p className="text-white/30 text-sm mt-10">
          Free · No credit card · Works on any phone
        </p>
      </div>

      {/* Floating status cards */}
      <div className="absolute bottom-10 left-4 hidden lg:flex flex-col gap-3 animate-pulse-slow">
        <div className="bg-brand-black-card border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <span className="w-3 h-3 rounded-full bg-crowd-quiet" />
          <div>
            <p className="text-white text-sm font-semibold">Walgreens — Oak St</p>
            <p className="text-white/40 text-xs">Quiet · 3 min ago</p>
          </div>
        </div>
        <div className="bg-brand-black-card border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <span className="w-3 h-3 rounded-full bg-crowd-busy" />
          <div>
            <p className="text-white text-sm font-semibold">CVS Pharmacy — Main</p>
            <p className="text-white/40 text-xs">Busy · 8 min ago</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 right-4 hidden lg:block">
        <div className="bg-brand-black-card border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
          <span className="w-3 h-3 rounded-full bg-crowd-moderate" />
          <div>
            <p className="text-white text-sm font-semibold">Whole Foods — 5th Ave</p>
            <p className="text-white/40 text-xs">Moderate · 12 min ago</p>
          </div>
        </div>
      </div>
    </section>
  )
}
