import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CrowdBadge from '../components/ui/CrowdBadge'
import FreshnessBadge from '../components/ui/FreshnessBadge'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { getPlace } from '../api/places'
import { getCrowdHistory } from '../api/crowd'

function BarChart({ data }) {
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map(d => {
        const color = d.level >= 75 ? 'bg-crowd-busy' : d.level >= 40 ? 'bg-crowd-moderate' : d.level > 0 ? 'bg-crowd-quiet' : 'bg-white/10'
        return (
          <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full ${color} rounded-sm opacity-80`} style={{ height: `${Math.max(d.level, 4)}%` }} />
            <span className="text-white/30 text-[10px]">{d.hour}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function PlaceDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [place, setPlace] = useState(null)
  const [history, setHistory] = useState([])
  const [tab, setTab] = useState('crowd')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPlace(id),
      getCrowdHistory(id),
    ]).then(([p, h]) => {
      setPlace(p)
      setHistory(h)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-white/40 text-sm">Loading…</div>
    </div>
  )

  if (!place) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-white/40 text-sm">Place not found.</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link to="/explore" className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-5 transition-colors">
          ← Back to explore
        </Link>

        {/* Header card */}
        <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-brand-blue/10 text-brand-blue border border-brand-blue/20 rounded-full px-2.5 py-0.5 capitalize">{place.category}</span>
                {place.is_verified && <span className="text-xs text-crowd-quiet">✓ Verified</span>}
              </div>
              <h1 className="text-white text-xl font-bold mb-1">{place.name}</h1>
              <p className="text-white/40 text-sm">{[place.area, place.city].filter(Boolean).join(', ')}</p>
              {place.address && <p className="text-white/30 text-xs mt-0.5">{place.address}</p>}
              {place.hours_open && <p className="text-crowd-quiet text-xs mt-1 font-medium">{place.hours_open}</p>}
            </div>
            <CrowdBadge level={place.level} size="lg" />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <FreshnessBadge reportedAt={place.last_reported_at} />
            {place.report_count > 0 && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-white/40 text-xs">{place.report_count} reports in last 2 hours</span>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-black-soft border border-white/10 rounded-xl p-1 mb-4">
          {['crowd', 'inventory'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}>
              {t === 'crowd' ? '📊 Crowd History' : '📦 Inventory'}
            </button>
          ))}
        </div>

        {tab === 'crowd' && (
          <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-1">Typical busy times</h2>
            <p className="text-white/40 text-xs mb-5">Based on community reports (last 90 days)</p>
            {history.length > 0 ? <BarChart data={history} /> : <p className="text-white/30 text-sm text-center py-6">Not enough data yet — be the first to report!</p>}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1 text-xs text-crowd-quiet"><span className="w-2 h-2 rounded-full bg-crowd-quiet" /> Quiet</span>
              <span className="flex items-center gap-1 text-xs text-crowd-moderate"><span className="w-2 h-2 rounded-full bg-crowd-moderate" /> Moderate</span>
              <span className="flex items-center gap-1 text-xs text-crowd-busy"><span className="w-2 h-2 rounded-full bg-crowd-busy" /> Busy</span>
            </div>
          </div>
        )}

        {tab === 'inventory' && (
          <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Item availability</h2>
            <p className="text-white/30 text-sm text-center py-8">Inventory reporting coming in Phase 2. <br />Submit a crowd report for now!</p>
          </div>
        )}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-brand-black border-t border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          {isAuthenticated ? (
            <Link to={`/submit-report?place=${place.id}`}>
              <Button fullWidth size="lg">Submit a Report · Earn Points</Button>
            </Link>
          ) : (
            <Link to={`/login?next=/submit-report?place=${place.id}`}>
              <Button fullWidth size="lg" variant="ghost">Log in to Submit a Report</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
