import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-blue border-b-2 border-brand-blue pb-0.5' : 'text-white/70 hover:text-white'}`

  return (
    <nav className="sticky top-0 z-50 bg-brand-black border-b border-white/10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-brand-blue text-2xl font-black">Q</span>
          <span className="text-white">finder</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/explore" className={linkClass}>Explore</NavLink>
          <NavLink to="/leaderboard" className={linkClass}>Leaderboard</NavLink>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/50">{user?.email || 'Account'}</span>
              <button onClick={handleLogout} className="text-sm text-white/70 hover:text-brand-red transition-colors">
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/register" className="bg-brand-blue hover:bg-brand-blue-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/70 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-brand-black-soft border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/explore" className={linkClass} onClick={() => setMenuOpen(false)}>Explore</NavLink>
          <NavLink to="/leaderboard" className={linkClass} onClick={() => setMenuOpen(false)}>Leaderboard</NavLink>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="text-left text-sm text-brand-red font-medium">Log out</button>
          ) : (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Log in</NavLink>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-brand-blue text-white text-sm font-semibold px-4 py-2.5 rounded-lg text-center">Sign up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
