import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import CrowdBadge from '../components/ui/CrowdBadge'
import FreshnessBadge from '../components/ui/FreshnessBadge'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const MOCK_PLACE = {
  id: 1,
  name: 'CVS Pharmacy',
  category: 'Pharmacy',
  address: '123 Main St, New York, NY',
  hours: 'Open · Closes at 10:00 PM',
  crowdLevel: 'busy',
  reportCount: 4,
  lastReport: new Date(Date.now() - 8 * 60000).toISOString(),
  inventory: [
    { item: 'Baby Formula', status: 'in_stock', reportedAt: new Date(Date.now() - 30 * 60000).toISOString() },
    { item: 'Ibuprofen 200mg', status: 'out_of_stock', reportedAt: new Date(Date.now() - 90 * 60000).toISOString() },
    { item: 'Hand Sanitizer', status: 'in_stock', reportedAt: new Date(Date.now() - 20 * 60000).toISOString() },
  ],
  history: [
    { hour: '8am', level: 20 },
    { hour: '9am', level: 40 },
    { hour: '10am', level: 70 },
    { hour: '11am', level: 85 },
    { hour: '12pm', level: 90 },
    { hour: '1pm', level: 75 },
    { hour: '2pm', level: 60 },
    { hour: '3pm', level: 55 },
    { hour: '4pm', level: 80 },
    { hour: '5pm', level: 95 },
    { hour: '6pm', level: 70 },
    { hour: '7pm', level: 45 },
  ]
}

function BarChart({ data }) {
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map(d => {
        const color = d.level >= 75 ? 'bg-crowd-busy' : d.level >= 45 ? 'bg-crowd-moderate' : 'bg-crowd-quiet'
        return (
          <div key={d.hour} className="flex-1 flex flex-col items-center gap-1">
            <div className={`w-full ${color} rounded-sm opacity-80`} style={{ height: `${d.level}%` }} />
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
  const [tab, setTab] = useState('crowd')
  const place = MOCK_PLACE

  return (
    <div className="min-h-screen bg-brand-black pb-24">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back link */}
        <Link to="/explore" className="text-white/40 hover:text-white text-sm flex items-center gap-1 mb-5 transition-colors">
          ← Back to explore
        </Link>

        {/* Header */}
        <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5 mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-brand-orange/10 text-brand-orange border border-brand-orange/20 rounded-full px-2.5 py-0.5">{place.category}</span>
              </div>
              <h1 className="text-white text-xl font-bold mb-1">{place.name}</h1>
              <p className="text-white/40 text-sm">{place.address}</p>
              <p className="text-crowd-quiet text-xs mt-1 font-medium">{place.hours}</p>
            </div>
            <CrowdBadge level={place.crowdLevel} size="lg" />
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
            <FreshnessBadge reportedAt={place.lastReport} />
            <span className="text-white/20">·</span>
            <span className="text-white/40 text-xs">{place.reportCount} reports in last 2 hours</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-brand-black-soft border border-white/10 rounded-xl p-1 mb-4">
          {['crowd', 'inventory'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize ${tab === t ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
            >
              {t === 'crowd' ? '📊 Crowd History' : '📦 Inventory'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'crowd' && (
          <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-1">Typical busy times</h2>
            <p className="text-white/40 text-xs mb-5">Based on last 90 days of community reports</p>
            <BarChart data={place.history} />
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1 text-xs text-crowd-quiet"><span className="w-2 h-2 rounded-full bg-crowd-quiet" /> Quiet</span>
              <span className="flex items-center gap-1 text-xs text-crowd-moderate"><span className="w-2 h-2 rounded-full bg-crowd-moderate" /> Moderate</span>
              <span className="flex items-center gap-1 text-xs text-crowd-busy"><span className="w-2 h-2 rounded-full bg-crowd-busy" /> Busy</span>
            </div>
          </div>
        )}

        {tab === 'inventory' && (
          <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4">Recently reported items</h2>
            {place.inventory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {place.inventory.map(item => (
                  <div key={item.item} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{item.item}</p>
                      <FreshnessBadge reportedAt={item.reportedAt} />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${item.status === 'in_stock' ? 'bg-crowd-quiet/20 text-crowd-quiet' : 'bg-crowd-busy/20 text-crowd-busy'}`}>
                      {item.status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/30 text-sm text-center py-8">No inventory reports yet. Be the first!</p>
            )}
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
