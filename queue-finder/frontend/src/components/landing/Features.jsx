const features = [
  {
    icon: '🔴',
    title: 'Live Crowd Levels',
    desc: 'Real-time Quiet / Moderate / Busy status for every store, updated by people on the ground.',
  },
  {
    icon: '📦',
    title: 'Item Availability',
    desc: 'Find out if what you need is in stock before you drive there. Baby formula, medicine, essentials.',
  },
  {
    icon: '🤝',
    title: 'Community Powered',
    desc: 'No corporate data feeds. Just real people helping each other save time every day.',
  },
  {
    icon: '📊',
    title: 'Best Time to Visit',
    desc: 'See when a store is typically quiet based on days and weeks of community reports.',
  },
  {
    icon: '🏆',
    title: 'Earn Points',
    desc: 'Get rewarded for reporting. Climb the leaderboard and earn badges for helping your community.',
  },
  {
    icon: '🤖',
    title: 'AI-Ready',
    desc: 'Ask your AI assistant about crowd levels. Qfinder connects to Claude and other AI tools via MCP.',
  },
]

export default function Features() {
  return (
    <section className="bg-brand-black-soft py-20 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Everything you need</h2>
          <p className="text-white/50 text-base max-w-md mx-auto">Built to be fast, free, and genuinely useful.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-brand-black border border-white/10 hover:border-brand-orange/30 rounded-xl p-5 transition-all group"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-white font-bold mb-1.5 group-hover:text-brand-orange transition-colors">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
