import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getStudentBookings, cancelBooking } from '../../api/bookingApi'
import { BookingCard } from '../../components/shared/UI'

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadBookings = async () => {
    try {
      const res = await getStudentBookings(user.id)
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

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    await cancelBooking(id)
    loadBookings()
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="font-syne text-4xl font-extrabold text-purple-900 mb-8">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-purple-500">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="card text-purple-500">No bookings yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              currentUserRole="student"
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  )
}