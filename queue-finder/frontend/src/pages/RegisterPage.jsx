import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      // TODO: replace with real API call
      login({ email }, 'mock-token-' + Date.now())
      navigate('/explore')
    } catch (err) {
      setError('Something went wrong. Please try again.')
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 text-sm mt-1">Free forever. No credit card needed.</p>
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
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-black border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium block mb-1.5">
                Password <span className="text-white/30 font-normal">(min 8 characters)</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-black border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-white/70 text-sm font-medium block mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-black border border-white/10 focus:border-brand-blue rounded-lg px-4 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
              />
            </div>

            <Button type="submit" fullWidth disabled={loading} className="mt-1">
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>

            <p className="text-white/30 text-xs text-center">
              By signing up you agree to use this app responsibly and report accurately.
            </p>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-blue hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  )
}
