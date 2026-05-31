import { useState } from 'react'

const BADGES = { 1: '🥇', 2: '🥈', 3: '🥉' }

const WEEKLY = [
  { rank: 1, name: 'Maria G.', points: 340, badge: 'Trusted Reporter', reports: 34 },
  { rank: 2, name: 'James T.', points: 295, badge: 'Crowd Watcher', reports: 29 },
  { rank: 3, name: 'Priya K.', points: 250, badge: 'Item Hunter', reports: 25 },
  { rank: 4, name: 'David L.', points: 190, badge: null, reports: 19 },
  { rank: 5, name: 'Sophie M.', points: 160, badge: null, reports: 16 },
  { rank: 6, name: 'Carlos R.', points: 130, badge: null, reports: 13 },
  { rank: 7, name: 'Aisha B.', points: 110, badge: null, reports: 11 },
  { rank: 8, name: 'Noah P.', points: 90, badge: null, reports: 9 },
  { rank: 9, name: 'Emma W.', points: 70, badge: null, reports: 7 },
  { rank: 10, name: 'Liam J.', points: 50, badge: null, reports: 5 },
]

const ALLTIME = [
  { rank: 1, name: 'Priya K.', points: 4820, badge: 'Veteran', reports: 482 },
  { rank: 2, name: 'Maria G.', points: 3950, badge: 'Trusted Reporter', reports: 395 },
  { rank: 3, name: 'Carlos R.', points: 3100, badge: 'Trusted Reporter', reports: 310 },
  { rank: 4, name: 'James T.', points: 2700, badge: 'Crowd Watcher', reports: 270 },
  { rank: 5, name: 'Emma W.', points: 2200, badge: 'Item Hunter', reports: 220 },
]

export default function LeaderboardPage() {
  const [tab, setTab] = useState('weekly')
  const data = tab === 'weekly' ? WEEKLY : ALLTIME

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Leaderboard</h1>
          <p className="text-white/40 text-sm">Top reporters helping the community</p>
        </div>

        {/* Tab toggle */}
        <div className="flex gap-1 bg-brand-black-soft border border-white/10 rounded-xl p-1 mb-6">
          {['weekly', 'alltime'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}
            >
              {t === 'weekly' ? '🔥 This Week' : '⭐ All Time'}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-3 mb-6">
          {[data[1], data[0], data[2]].filter(Boolean).map((entry, i) => {
            const isFirst = entry.rank === 1
            return (
              <div key={entry.rank} className={`flex-1 text-center ${isFirst ? 'order-2' : i === 0 ? 'order-1' : 'order-3'}`}>
                <div className={`rounded-xl p-4 border ${isFirst ? 'bg-brand-blue/10 border-brand-blue/40' : 'bg-brand-black-soft border-white/10'}`}>
                  <div className="text-3xl mb-1">{BADGES[entry.rank]}</div>
                  <p className={`font-bold text-sm ${isFirst ? 'text-brand-blue' : 'text-white'}`}>{entry.name}</p>
                  <p className="text-white/40 text-xs">{entry.points.toLocaleString()} pts</p>
                  {entry.badge && <p className="text-white/30 text-xs mt-1">{entry.badge}</p>}
                </div>
                <div className={`h-1 rounded-full mt-1 mx-auto w-3/4 ${isFirst ? 'bg-brand-blue' : 'bg-white/10'}`} />
              </div>
            )
          })}
        </div>

        {/* Full list */}
        <div className="flex flex-col gap-2">
          {data.map(entry => (
            <div
              key={entry.rank}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${
                entry.rank <= 3
                  ? 'bg-brand-black-card border-white/15'
                  : 'bg-brand-black-soft border-white/10'
              }`}
            >
              {/* Rank */}
              <span className={`w-7 text-center font-black text-sm ${entry.rank === 1 ? 'text-yellow-400' : entry.rank === 2 ? 'text-gray-300' : entry.rank === 3 ? 'text-amber-600' : 'text-white/30'}`}>
                {BADGES[entry.rank] || `#${entry.rank}`}
              </span>

              {/* Avatar placeholder */}
              <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue text-xs font-bold shrink-0">
                {entry.name[0]}
              </div>

              {/* Name + badge */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{entry.name}</p>
                {entry.badge && <p className="text-white/30 text-xs">{entry.badge}</p>}
              </div>

              {/* Stats */}
              <div className="text-right shrink-0">
                <p className="text-brand-blue font-bold text-sm">{entry.points.toLocaleString()}</p>
                <p className="text-white/30 text-xs">{entry.reports} reports</p>
              </div>
            </div>
          ))}
        </div>

        {/* Your rank (placeholder) */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-brand-blue/20 bg-brand-blue/5">
            <span className="w-7 text-center text-white/30 font-bold text-sm">#47</span>
            <div className="w-8 h-8 rounded-full bg-brand-blue/30 flex items-center justify-center text-brand-blue text-xs font-bold shrink-0">Y</div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">You</p>
              <p className="text-white/30 text-xs">Keep reporting to climb the board!</p>
            </div>
            <div className="text-right">
              <p className="text-brand-blue font-bold text-sm">85</p>
              <p className="text-white/30 text-xs">8 reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
