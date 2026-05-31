import client from './client'

export async function getNearbyPlaces(lat, lon, radiusKm = 5) {
  const res = await client.get('/places/nearby', { params: { lat, lon, radius_km: radiusKm } })
  return res.data
}

export async function searchPlaces(q, lat, lon) {
  const res = await client.get('/places/search', { params: { q, lat, lon } })
  return res.data
}

export async function getPlace(id, lat, lon) {
  const res = await client.get(`/places/${id}`, { params: { lat, lon } })
  return res.data
}

export async function addPlace(data) {
  const res = await client.post('/places/', data)
  return res.data
}
