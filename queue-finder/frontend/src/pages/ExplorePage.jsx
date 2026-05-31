import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import CrowdBadge from '../components/ui/CrowdBadge'
import FreshnessBadge from '../components/ui/FreshnessBadge'
import { getNearbyPlaces, searchPlaces } from '../api/places'

function PlaceCard({ place }) {
  return (
    <Link
      to={`/place/${place.id}`}
      className="bg-brand-black-soft border border-white/10 hover:border-brand-blue/30 rounded-xl p-4 flex items-center justify-between transition-all group"
    >
      <div className="flex-1 min-w-0 mr-4">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <h3 className="text-white font-semibold text-sm group-hover:text-brand-blue transition-colors truncate">{place.name}</h3>
          <span className="text-white/30 text-xs bg-white/5 px-2 py-0.5 rounded-full shrink-0 capitalize">{place.category}</span>
        </div>
        <p className="text-white/40 text-xs mb-1.5">
          {[place.area, place.city].filter(Boolean).join(', ')}
          {place.distance ? ` · ${place.distance}` : ''}
        </p>
        <FreshnessBadge reportedAt={place.last_reported_at} />
      </div>
      <div className="shrink-0">
        <CrowdBadge level={place.level} size="sm" />
      </div>
    </Link>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-brand-black-soft border border-white/10 rounded-xl p-4 flex items-center justify-between">
      <div className="flex-1 mr-4">
        <div className="h-4 bg-brand-black-card rounded shimmer w-3/4 mb-2" />
        <div className="h-3 bg-brand-black-card rounded shimmer w-1/2" />
      </div>
      <div className="h-6 w-20 bg-brand-black-card rounded-full shimmer" />
    </div>
  )
}

export default function ExplorePage() {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState('list')
  const [userPos, setUserPos] = useState(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserPos({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setUserPos({ lat: 19.1136, lon: 72.8697 }) // fallback: Mumbai Andheri
    )
  }, [])

  useEffect(() => {
    if (!userPos) return
    setLoading(true)
    getNearbyPlaces(userPos.lat, userPos.lon, 10)
      .then(setPlaces)
      .catch(() => setError('Could not load places. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [userPos])

  const handleSearch = useCallback(async (q) => {
    setQuery(q)
    if (!q.trim()) {
      if (userPos) {
        setLoading(true)
        getNearbyPlaces(userPos.lat, userPos.lon, 10).then(setPlaces).finally(() => setLoading(false))
      }
      return
    }
    try {
      const results = await searchPlaces(q, userPos?.lat, userPos?.lon)
      setPlaces(results)
    } catch {
      // keep existing list
    }
  }, [userPos])

  return (
    <div className="min-h-screen bg-brand-black">
      {/* Sticky search bar */}
      <div className="sticky top-14 z-40 bg-brand-black/95 backdrop-blur border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search stores, pharmacies, kirana…"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              className="w-full bg-brand-black-soft border border-white/10 focus:border-brand-blue rounded-lg pl-9 pr-4 py-2.5 text-white placeholder-white/30 outline-none transition-colors text-sm"
            />
          </div>
          <div className="flex items-center bg-brand-black-soft border border-white/10 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'list' ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}>
              ☰ List
            </button>
            <button onClick={() => setViewMode('map')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === 'map' ? 'bg-brand-blue text-white' : 'text-white/50 hover:text-white'}`}>
              🗺 Map
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <span className="text-white/40 text-xs">Crowd level:</span>
          <span className="flex items-center gap-1 text-xs text-crowd-quiet"><span className="w-2 h-2 rounded-full bg-crowd-quiet" /> Quiet</span>
          <span className="flex items-center gap-1 text-xs text-crowd-moderate"><span className="w-2 h-2 rounded-full bg-crowd-moderate" /> Moderate</span>
          <span className="flex items-center gap-1 text-xs text-crowd-busy"><span className="w-2 h-2 rounded-full bg-crowd-busy" /> Busy</span>
        </div>

        {error && (
          <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {!loading && <p className="text-white/40 text-xs mb-4">{places.length} places found near you</p>}

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : places.length > 0 ? (
          <div className="flex flex-col gap-3">
            {places.map(p => <PlaceCard key={p.id} place={p} />)}
          </div>
        ) : (
          <div className="text-center py-12 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p>No places found{query ? ` for "${query}"` : ' near you'}</p>
            <p className="text-xs mt-2">Try searching by name or area</p>
          </div>
        )}
      </div>
    </div>
  )
}
