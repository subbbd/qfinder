import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiLogin } from '../api/users'
import Button from '../components/ui/Button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/explore'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(email, password)
      login(data.user, data.access_token)
      navigate(next)
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-black">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 text-2xl font-black mb-6">
            <span className="text-brand-blue">Q</span>
            <span className="text-white">finder</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 text-sm mt-1">Log in to report and earn points</p>
        </div>

        <div className="bg-brand-black-soft border border-white/10 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-brand-red/10 border border-brand-red/30 text-brand-red text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="text-white/70 text-sm font-medium block mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-black border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/70 text-sm font-medium">Password</label>
                <button type="button" className="text-brand-blue text-xs hover:underline">Forgot password?</button>
              </div>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-black border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm" />
            </div>
            <Button type="submit" fullWidth disabled={loading} className="mt-1">
              {loading ? 'Logging in…' : 'Log in'}
            </Button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-blue hover:underline font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  )
}
