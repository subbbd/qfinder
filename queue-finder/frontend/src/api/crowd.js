import client from './client'

export async function submitCrowdReport(placeId, level, note, lat, lon) {
  const res = await client.post('/crowd/report', {
    place_id: placeId,
    level,
    note: note || null,
    latitude: lat || null,
    longitude: lon || null,
  })
  return res.data
}

export async function getCrowdLevel(placeId) {
  const res = await client.get(`/crowd/place/${placeId}`)
  return res.data
}

export async function getCrowdHistory(placeId) {
  const res = await client.get(`/crowd/place/${placeId}/history`)
  return res.data
}
