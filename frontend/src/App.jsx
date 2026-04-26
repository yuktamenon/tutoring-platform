import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, RoleRoute } from './components/shared/ProtectedRoute'
import Navbar from './components/shared/Navbar'

// Public pages
import LandingPage    from './pages/public/LandingPage'
import LoginPage      from './pages/public/LoginPage'
import RegisterPage   from './pages/public/RegisterPage'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import TutorSearch      from './pages/student/TutorSearch'
import MyBookings       from './pages/student/MyBookings'

// Tutor pages
import TutorDashboard    from './pages/tutor/TutorDashboard'
import TutorProfileSetup from './pages/tutor/TutorProfileSetup'
import ManageSubjects    from './pages/tutor/ManageSubjects'
import ManageAvailability from './pages/tutor/ManageAvailability'

// Shared pages
import TutorPublicProfile from './pages/shared/TutorPublicProfile'
import BookingDetail      from './pages/shared/BookingDetail'

export default function App() {
  const cursorRef = useRef(null)
  const ringRef   = useRef(null)
  const ringPos   = useRef({ x: 0, y: 0 })
  const rafRef    = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    const move = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
    }

    const animate = () => {
      ringPos.current.x += (parseFloat(cursorRef.current?.style.left || 0) - ringPos.current.x) * 0.12
      ringPos.current.y += (parseFloat(cursorRef.current?.style.top  || 0) - ringPos.current.y) * 0.12
      if (ring) {
        ring.style.left = ringPos.current.x + 'px'
        ring.style.top  = ringPos.current.y + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move)
    rafRef.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <AuthProvider>
      <div id="cursor" ref={cursorRef} />
      <div id="cursor-ring" ref={ringRef} />
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/tutors/:tutorUserId" element={<TutorPublicProfile />} />

        {/* Protected — student only */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleRoute role="student" />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/search"    element={<TutorSearch />} />
            <Route path="/student/bookings"  element={<MyBookings />} />
          </Route>

          {/* Protected — tutor only */}
          <Route element={<RoleRoute role="tutor" />}>
            <Route path="/tutor/dashboard"     element={<TutorDashboard />} />
            <Route path="/tutor/profile-setup" element={<TutorProfileSetup />} />
            <Route path="/tutor/subjects"      element={<ManageSubjects />} />
            <Route path="/tutor/availability"  element={<ManageAvailability />} />
          </Route>

          {/* Protected — both roles */}
          <Route path="/bookings/:bookingId" element={<BookingDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
