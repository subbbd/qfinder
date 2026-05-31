import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

const CROWD_LEVELS = [
  { value: 'quiet', label: 'Quiet', emoji: '🟢', desc: 'Few people, no wait', color: 'border-crowd-quiet bg-crowd-quiet/10 text-crowd-quiet' },
  { value: 'moderate', label: 'Moderate', emoji: '🟡', desc: 'Some people, short wait', color: 'border-crowd-moderate bg-crowd-moderate/10 text-crowd-moderate' },
  { value: 'busy', label: 'Busy', emoji: '🔴', desc: 'Crowded, long wait', color: 'border-crowd-busy bg-crowd-busy/10 text-crowd-busy' },
]

export default function SubmitReportPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const placeId = params.get('place')

  const [reportType, setReportType] = useState('crowd')
  const [crowdLevel, setCrowdLevel] = useState(null)
  const [itemName, setItemName] = useState('')
  const [itemStatus, setItemStatus] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [points, setPoints] = useState(0)

  function handleCrowdSubmit() {
    if (!crowdLevel) return
    setPoints(5)
    setSubmitted(true)
  }

  function handleInventorySubmit() {
    if (!itemName || !itemStatus) return
    setPoints(10)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-white mb-2">Report submitted!</h2>
          <p className="text-white/50 text-sm mb-2">Thank you for helping your community.</p>
          <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full px-5 py-2 mb-8">
            <span className="text-brand-orange font-bold text-lg">+{points} points</span>
            <span className="text-white/50 text-sm">earned</span>
          </div>
          <div className="flex flex-col gap-3">
            <Link to={placeId ? `/place/${placeId}` : '/explore'}>
              <Button fullWidth>Back to Store</Button>
            </Link>
            <button onClick={() => { setSubmitted(false); setCrowdLevel(null); setItemName(''); setItemStatus(null) }} className="text-white/40 hover:text-white text-sm transition-colors">
              Submit another report
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to={placeId ? `/place/${placeId}` : '/explore'} className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
            ← Back
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Submit a Report</h1>
          <p className="text-white/40 text-sm">Help others know what's happening right now</p>
        </div>

        {/* Report type selector */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'crowd', label: '👥 Crowd Level', pts: '+5 pts' },
            { key: 'inventory', label: '📦 Item Stock', pts: '+10 pts' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setReportType(t.key)}
              className={`flex-1 py-3 px-3 rounded-xl border text-sm font-semibold transition-all flex flex-col items-center gap-0.5 ${
                reportType === t.key
                  ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                  : 'border-white/10 bg-brand-black-soft text-white/50 hover:text-white'
              }`}
            >
              {t.label}
              <span className="text-xs font-normal opacity-60">{t.pts}</span>
            </button>
          ))}
        </div>

        {/* Crowd report panel */}
        {reportType === 'crowd' && (
          <div>
            <p className="text-white/60 text-sm mb-4">How busy is it right now?</p>
            <div className="flex flex-col gap-3 mb-6">
              {CROWD_LEVELS.map(level => (
                <button
                  key={level.value}
                  onClick={() => setCrowdLevel(level.value)}
                  className={`border-2 rounded-xl px-5 py-4 flex items-center gap-4 transition-all ${
                    crowdLevel === level.value ? level.color : 'border-white/10 bg-brand-black-soft hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <div className="text-left">
                    <p className={`font-bold ${crowdLevel === level.value ? '' : 'text-white'}`}>{level.label}</p>
                    <p className={`text-xs ${crowdLevel === level.value ? 'opacity-70' : 'text-white/40'}`}>{level.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <Button fullWidth size="lg" disabled={!crowdLevel} onClick={handleCrowdSubmit}>
              Submit Crowd Report
            </Button>
          </div>
        )}

        {/* Inventory report panel */}
        {reportType === 'inventory' && (
          <div>
            <div className="mb-4">
              <label className="text-white/70 text-sm font-medium block mb-1.5">What item are you reporting?</label>
              <input
                type="text"
                value={itemName}
                onChange={e => setItemName(e.target.value)}
                placeholder="e.g. Baby formula, Ibuprofen…"
                className="w-full bg-brand-black-soft border border-white/10 focus:border-brand-orange rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
              />
            </div>

            <p className="text-white/60 text-sm mb-3">Is it in stock?</p>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setItemStatus('in_stock')}
                className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  itemStatus === 'in_stock'
                    ? 'border-crowd-quiet bg-crowd-quiet/10 text-crowd-quiet'
                    : 'border-white/10 bg-brand-black-soft text-white/50 hover:text-white'
                }`}
              >
                ✅ In Stock
              </button>
              <button
                onClick={() => setItemStatus('out_of_stock')}
                className={`flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all ${
                  itemStatus === 'out_of_stock'
                    ? 'border-crowd-busy bg-crowd-busy/10 text-crowd-busy'
                    : 'border-white/10 bg-brand-black-soft text-white/50 hover:text-white'
                }`}
              >
                ❌ Out of Stock
              </button>
            </div>
            <Button fullWidth size="lg" disabled={!itemName || !itemStatus} onClick={handleInventorySubmit}>
              Submit Inventory Report
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
