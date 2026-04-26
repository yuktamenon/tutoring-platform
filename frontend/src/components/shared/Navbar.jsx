import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard' },
    { to: '/student/search',    label: 'Find Tutors' },
    { to: '/student/bookings',  label: 'My Bookings' },
  ]
  const tutorLinks = [
    { to: '/tutor/dashboard',     label: 'Dashboard' },
    { to: '/tutor/profile-setup', label: 'My Profile' },
    { to: '/tutor/subjects',      label: 'Subjects' },
    { to: '/tutor/availability',  label: 'Availability' },
  ]
  const links = user?.role === 'tutor' ? tutorLinks : user?.role === 'student' ? studentLinks : []

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
      ${scrolled ? 'bg-purple-50/90 backdrop-blur-lg shadow-sm shadow-purple-200/50' : 'bg-purple-50/70 backdrop-blur-sm'}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to={isAuthenticated ? (user?.role === 'tutor' ? '/tutor/dashboard' : '/student/dashboard') : '/'} 
          className="font-syne font-extrabold text-xl text-purple-800">
          Study<span className="text-yellow-500">Budee</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium transition-colors ${location.pathname === l.to ? 'text-purple-600' : 'text-purple-700 hover:text-purple-500'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-purple-800">{user?.name}</span>
              </div>
              <button onClick={logout}
                className="text-sm font-medium text-purple-500 hover:text-purple-700 transition-colors border border-purple-200 rounded-full px-4 py-1.5">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
          {/* Mobile hamburger */}
          {isAuthenticated && (
            <button className="md:hidden ml-1 text-purple-700" onClick={() => setMenuOpen(o => !o)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/> 
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-50/95 backdrop-blur-lg border-t border-purple-100 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-purple-700 hover:text-purple-500 py-1">{l.label}</Link>
          ))}
          <button onClick={logout} className="text-sm font-medium text-left text-red-400 hover:text-red-500 py-1">Logout</button>
        </div>
      )}
    </nav>
  )
}
