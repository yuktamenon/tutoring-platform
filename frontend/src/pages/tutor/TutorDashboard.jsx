import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getTutorBookings, acceptBooking, rejectBooking, cancelBooking, completeBooking } from '../../api/bookingApi'
import { BookingCard } from '../../components/shared/UI'
import { Link } from 'react-router-dom'

export default function TutorDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = async () => {
    try {
      const res = await getTutorBookings(user.id)
      setBookings(res.data.bookings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  const action = async (fn, id) => {
    await fn(id)
    loadBookings()
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-syne text-4xl font-extrabold text-purple-900">
            Tutor Dashboard
          </h1>
          <p className="text-purple-500 mt-2">Manage your tutoring requests and sessions.</p>
        </div>

        <div className="flex gap-2">
          <Link to="/tutor/profile-setup" className="btn-secondary px-4 py-2">Profile</Link>
          <Link to="/tutor/availability" className="btn-primary px-4 py-2">Availability</Link>
        </div>
      </div>

      {loading ? (
        <p className="text-purple-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card text-purple-500">No booking requests yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUserRole="tutor"
              onAccept={(id) => action(acceptBooking, id)}
              onReject={(id) => action(rejectBooking, id)}
              onCancel={(id) => action(cancelBooking, id)}
              onComplete={(id) => action(completeBooking, id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}