import { useState } from 'react'
import CrowdBadge from '../components/ui/CrowdBadge'
import FreshnessBadge from '../components/ui/FreshnessBadge'
import { Link } from 'react-router-dom'

// Mock data until backend is connected
const MOCK_PLACES = [
  { id: 1, name: 'CVS Pharmacy', category: 'Pharmacy', address: '123 Main St', distance: '0.3 mi', crowdLevel: 'busy', lastReport: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 2, name: 'Walgreens', category: 'Pharmacy', address: '456 Oak Ave', distance: '0.7 mi', crowdLevel: 'quiet', lastReport: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 3, name: 'Whole Foods Market', category: 'Grocery', address: '789 5th Ave', distance: '1.1 mi', crowdLevel: 'moderate', lastReport: new Date(Date.now() - 22 * 60000).toISOString() },
  { id: 4, name: 'Trader Joe\'s', category: 'Grocery', address: '321 Elm St', distance: '1.4 mi', crowdLevel: 'busy', lastReport: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 5, name: 'Rite Aid', category: 'Pharmacy', address: '654 Park Blvd', distance: '1.8 mi', crowdLevel: 'none', lastReport: null },
  { id: 6, name: 'Target', category: 'General', address: '987 Commerce Dr', distance: '2.1 mi', crowdLevel: 'moderate', lastReport: new Date(Date.now() - 45 * 60000).toISOString() },
]

function PlaceCard({ place }) {
  return (
    <Link
      to={`/place/${place.id}`}
      className="bg-brand-black-soft border border-white/10 hover:border-brand-orange/30 rounded-xl p-4 flex items-center justify-between transition-all group"
    >
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-white font-semibold text-sm group-hover:text-brand-orange transition-colors truncate">{place.name}</h3>
          <span className="text-white/30 text-xs bg-white/5 px-2 py-0.5 rounded-full shrink-0">{place.category}</span>
        </div>
        <p className="text-white/40 text-xs mb-1.5">{place.address} · {place.distance}</p>
        <FreshnessBadge reportedAt={place.lastReport} />
      </div>
      <div className="shrink-0">
        <CrowdBadge level={place.crowdLevel} size="sm" />
      </div>
    </Link>
  )
}

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')

  const filtered = MOCK_PLACES.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Sticky search bar */}
      <div className="sticky top-14 z-40 bg-brand-black/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search stores, pharmacies…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-brand-black-soft border border-white/10 focus:border-brand-orange rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors text-sm"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-brand-black-soft border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'map' ? 'bg-brand-orange text-white' : 'text-white/50 hover:text-white'}`}
            >
              🗺 Map
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {viewMode === 'list' ? (
          <>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span className="text-white/40 text-xs">Crowd level:</span>
              <span className="flex items-center gap-1 text-xs text-crowd-quiet"><span className="w-2 h-2 rounded-full bg-crowd-quiet" /> Quiet</span>
              <span className="flex items-center gap-1 text-xs text-crowd-moderate"><span className="w-2 h-2 rounded-full bg-crowd-moderate" /> Moderate</span>
              <span className="flex items-center gap-1 text-xs text-crowd-busy"><span className="w-2 h-2 rounded-full bg-crowd-busy" /> Busy</span>
            </div>

            {/* Count */}
            <p className="text-white/40 text-xs mb-4">{filtered.length} places near you</p>

            {/* List */}
            <div className="flex flex-col gap-3">
              {filtered.length > 0 ? (
                filtered.map(p => <PlaceCard key={p.id} place={p} />)
              ) : (
                <div className="text-center py-12 text-white/30">
                  <p className="text-4xl mb-3">🔍</p>
                  <p>No stores found for "{query}"</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <p className="text-4xl mb-4">🗺️</p>
            <p className="font-semibold mb-1">Map view coming soon</p>
            <p className="text-sm">Use list view for now</p>
            <button onClick={() => setViewMode('list')} className="mt-4 text-brand-orange text-sm hover:underline">
              Switch to list →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
