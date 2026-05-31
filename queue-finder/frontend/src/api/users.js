import client from './client'

export async function apiRegister(email, password, displayName) {
  const res = await client.post('/auth/register', { email, password, display_name: displayName })
  return res.data
}

export async function apiLogin(email, password) {
  const res = await client.post('/auth/login',
    new URLSearchParams({ username: email, password }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )
  return res.data
}

export async function apiMe() {
  const res = await client.get('/auth/me')
  return res.data
}

export async function apiLeaderboard(type = 'weekly') {
  const res = await client.get(`/leaderboard/${type}`)
  return res.data
}
