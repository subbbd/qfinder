import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Button from '../components/ui/Button'
import { submitCrowdReport } from '../api/crowd'
import { getPlace } from '../api/places'

const CROWD_LEVELS = [
  { value: 'quiet',    label: 'Quiet',    emoji: '🟢', desc: 'Few people, no wait',     color: 'border-crowd-quiet bg-crowd-quiet/10 text-crowd-quiet' },
  { value: 'moderate', label: 'Moderate', emoji: '🟡', desc: 'Some people, short wait',  color: 'border-crowd-moderate bg-crowd-moderate/10 text-crowd-moderate' },
  { value: 'busy',     label: 'Busy',     emoji: '🔴', desc: 'Crowded, long wait',       color: 'border-crowd-busy bg-crowd-busy/10 text-crowd-busy' },
]

export default function SubmitReportPage() {
  const [params] = useSearchParams()
  const placeId = params.get('place')

  const [place, setPlace] = useState(null)
  const [reportType, setReportType] = useState('crowd')
  const [crowdLevel, setCrowdLevel] = useState(null)
  const [note, setNote] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemStatus, setItemStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [points, setPoints] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (placeId) getPlace(placeId).then(setPlace).catch(() => {})
  }, [placeId])

  async function handleCrowdSubmit() {
    if (!crowdLevel) return
    setLoading(true)
    setError('')
    try {
      const res = await submitCrowdReport(placeId, crowdLevel, note)
      setPoints(res.points_earned || 5)
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-white mb-2">Report submitted!</h2>
        <p className="text-white/50 text-sm mb-4">Thank you for helping your community.</p>
        <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 rounded-full px-5 py-2 mb-8">
          <span className="text-brand-blue font-bold text-lg">+{points} points</span>
          <span className="text-white/50 text-sm">earned</span>
        </div>
        <div className="flex flex-col gap-3">
          <Link to={placeId ? `/place/${placeId}` : '/explore'}>
            <Button fullWidth>Back to Store</Button>
          </Link>
          <button onClick={() => { setSubmitted(false); setCrowdLevel(null); setNote('') }}
            className="text-white/40 hover:text-white text-sm transition-colors">
            Submit another report
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to={placeId ? `/place/${placeId}` : '/explore'}
            className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Submit a Report</h1>
          {place && <p className="text-brand-blue text-sm font-medium">{place.name}</p>}
          <p className="text-white/40 text-sm">Help others know what's happening right now</p>
        </div>

        {/* Report type selector */}
        <div className="flex gap-2 mb-6">
          {[{ key: 'crowd', label: '👥 Crowd Level', pts: '+5 pts' }, { key: 'inventory', label: '📦 Item Stock', pts: '+10 pts' }].map(t => (
            <button key={t.key} onClick={() => setReportType(t.key)}
              className={`flex-1 py-3 px-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-0.5 ${
                reportType === t.key ? 'border-brand-blue bg-brand-blue/10 text-brand-blue' : 'border-white/10 bg-brand-black-soft text-white/50 hover:text-white'
              }`}>
              {t.label}
              <span className="text-xs font-normal opacity-60">{t.pts}</span>
            </button>
          ))}
        </div>

        {error && <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        {reportType === 'crowd' && (
          <div>
            <p className="text-white/60 text-sm mb-4">How busy is it right now?</p>
            <div className="flex flex-col gap-3 mb-4">
              {CROWD_LEVELS.map(level => (
                <button key={level.value} onClick={() => setCrowdLevel(level.value)}
                  className={`border-2 rounded-xl px-5 py-4 flex items-center gap-4 transition-all ${crowdLevel === level.value ? level.color : 'border-white/10 bg-brand-black-soft hover:border-white/20'}`}>
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="text-left">
                    <p className={`font-bold ${crowdLevel === level.value ? '' : 'text-white'}`}>{level.label}</p>
                    <p className={`text-xs ${crowdLevel === level.value ? 'opacity-70' : 'text-white/40'}`}>{level.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="mb-4">
              <input type="text" value={note} onChange={e => setNote(e.target.value)}
                placeholder="Optional note (e.g. 'Queue outside the door')"
                className="w-full bg-brand-black-soft border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm" />
            </div>
            <Button fullWidth size="lg" disabled={!crowdLevel || loading} onClick={handleCrowdSubmit}>
              {loading ? 'Submitting…' : 'Submit Crowd Report'}
            </Button>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">📦</p>
            <p className="text-white/50 text-sm">Inventory reporting coming in Phase 2.</p>
            <button onClick={() => setReportType('crowd')} className="text-brand-blue text-sm mt-4 hover:underline">
              Submit a crowd report instead →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
