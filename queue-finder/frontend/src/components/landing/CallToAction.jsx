import { Link } from 'react-router-dom'

export default function CallToAction() {
  return (
    <section className="bg-brand-blue py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Stop guessing. Start knowing.
        </h2>
        <p className="text-white/80 text-lg mb-8">
          Join the community helping each other find the right store at the right time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/explore"
            className="bg-white text-brand-blue font-bold px-8 py-4 rounded-xl text-base hover:bg-brand-blue-light transition-all"
          >
            Explore Stores
          </Link>
          <Link
            to="/register"
            className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-all"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </section>
  )
}
