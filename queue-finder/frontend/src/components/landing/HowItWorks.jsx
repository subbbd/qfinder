const steps = [
  {
    number: '01',
    icon: '📍',
    title: 'Find a store near you',
    desc: 'Open Qfinder and see all nearby pharmacies, grocery stores, and shops on a map or list.',
  },
  {
    number: '02',
    icon: '👀',
    title: 'Check crowd & stock',
    desc: 'See live crowd levels — Quiet, Moderate, or Busy — and whether items are in stock, reported by real people.',
  },
  {
    number: '03',
    icon: '🕐',
    title: 'Go at the right time',
    desc: 'Pick the best store, skip the queues, and get what you need without wasting a trip.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-brand-black py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Simple as 1, 2, 3</h2>
          <p className="text-white/50 text-base max-w-md mx-auto">No complicated setup. Just open the app and go.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative bg-brand-black-soft border border-white/10 rounded-2xl p-6">
              {/* Step number */}
              <span className="text-brand-orange/20 text-6xl font-black absolute top-4 right-5 leading-none select-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className="text-3xl mb-4">{step.icon}</div>

              {/* Content */}
              <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
