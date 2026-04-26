import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getRecommendedTutors, getLearningPathRecommendations } from '../../api/recommendationApi'
import { getStudentBookings } from '../../api/bookingApi'
import { TutorCard, BookingCard } from '../../components/shared/UI'

export default function StudentDashboard() {
  const { user } = useAuth()
  const [recommended, setRecommended] = useState([])
  const [paths, setPaths] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [recRes, pathRes, bookingRes] = await Promise.all([
          getRecommendedTutors(user.id),
          getLearningPathRecommendations(user.id),
          getStudentBookings(user.id)
        ])

        setRecommended(recRes.data.recommendations || [])
        setPaths(pathRes.data.recommendations || [])
        setBookings(bookingRes.data.bookings || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user.id])

  const upcoming = bookings.filter(b => ['requested', 'accepted'].includes(b.status)).slice(0, 3)

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-syne text-4xl font-extrabold text-purple-900">
          Hi, {user.name} 👋
        </h1>
        <p className="text-purple-500 mt-2">
          Find tutors, manage bookings, and continue your learning path.
        </p>
      </div>

      {loading ? (
        <p className="text-purple-500">Loading dashboard...</p>
      ) : (
        <div className="space-y-10">
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-syne text-2xl font-bold text-purple-900">
                Recommended Tutors
              </h2>
              <Link to="/student/search" className="text-purple-600 font-semibold text-sm">
                Find more →
              </Link>
            </div>

            {recommended.length === 0 ? (
              <div className="card text-purple-500">No recommendations yet. Book a session first.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-5">
                {recommended.slice(0, 3).map((item, index) => (
                  <div key={index}>
                    <TutorCard tutor={item.tutor} />
                    <p className="text-xs text-purple-400 mt-2">{item.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-syne text-2xl font-bold text-purple-900 mb-4">
              Suggested Next Subjects
            </h2>

            {paths.length === 0 ? (
              <div className="card text-purple-500">No learning path suggestions yet.</div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {paths.map((p, i) => (
                  <div className="card" key={i}>
                    <div className="text-sm text-purple-400">{p.fromSubject}</div>
                    <div className="font-syne text-xl font-bold text-purple-800">
                      {p.recommendedNextSubject}
                    </div>
                    <p className="text-sm text-purple-500 mt-2">{p.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-syne text-2xl font-bold text-purple-900">
                Upcoming Bookings
              </h2>
              <Link to="/student/bookings" className="text-purple-600 font-semibold text-sm">
                View all →
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="card text-purple-500">No upcoming bookings yet.</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {upcoming.map(b => (
                  <BookingCard key={b.id} booking={b} currentUserRole="student" />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}