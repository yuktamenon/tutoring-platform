import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTutorProfile } from '../../api/tutorApi'
import { getTutorReviews } from '../../api/reviewApi'
import { requestBooking } from '../../api/bookingApi'
import { StarRating } from '../../components/shared/UI'
import { useAuth } from '../../context/AuthContext'

export default function TutorPublicProfile() {
  const { tutorUserId } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState('')
  const [booking, setBooking] = useState({
    subjectId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    requestMessage: ''
  })

  useEffect(() => {
    async function load() {
      try {
        const profileRes = await getTutorProfile(tutorUserId)
        setProfile(profileRes.data)

        const reviewRes = await getTutorReviews(tutorUserId)
        setReviews(reviewRes.data.reviews || [])
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [tutorUserId])

  const subjects = profile?.subjects || []
  const availability = profile?.availability || []

  const handleChange = (e) => {
    setMessage('')
    setBooking({ ...booking, [e.target.name]: e.target.value })
  }

  const handleSlotClick = (slot) => {
    setBooking({
      ...booking,
      startTime: slot.startTime,
      endTime: slot.endTime
    })
  }

  const handleBooking = async (e) => {
    e.preventDefault()

    try {
      await requestBooking({
        tutorId: Number(tutorUserId),
        subjectId: Number(booking.subjectId),
        bookingDate: booking.bookingDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        requestMessage: booking.requestMessage
      })

      setMessage('Booking requested successfully.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not request booking.')
    }
  }

  if (!profile) {
    return <div className="min-h-screen pt-24 px-4">Loading tutor profile...</div>
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <h1 className="font-syne text-4xl font-extrabold text-purple-900">
              {profile.user?.name}
            </h1>
            <p className="text-purple-500 mt-1">{profile.experience}</p>

            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={profile.averageRating || 0} />
              <span className="text-sm text-purple-500">
                {profile.averageRating || 0} rating · {profile.totalSessionsCompleted || 0} sessions
              </span>
            </div>

            <p className="text-purple-700 mt-5">{profile.bio}</p>

            <div className="mt-5 font-syne font-bold text-purple-700 text-xl">
              ₹{profile.rate}/hr
            </div>
          </div>

          <div className="card">
            <h2 className="font-syne text-xl font-bold text-purple-900 mb-3">Subjects</h2>
            <div className="flex flex-wrap gap-2">
              {subjects.map(s => (
                <span key={s.id} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                  {s.subject.name}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="font-syne text-xl font-bold text-purple-900 mb-3">Reviews</h2>
            {reviews.length === 0 ? (
              <p className="text-purple-500">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-purple-100 pb-3">
                    <StarRating rating={r.rating} />
                    <p className="text-purple-700 mt-1">{r.feedback}</p>
                    <p className="text-xs text-purple-400 mt-1">By {r.student?.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleBooking} className="card h-fit space-y-4">
          <h2 className="font-syne text-xl font-bold text-purple-900">Request Booking</h2>

          {message && <p className="text-sm text-purple-600">{message}</p>}

          {user?.role !== 'student' && (
            <p className="text-sm text-yellow-700 bg-yellow-50 rounded-xl px-3 py-2">
              Login as student to request booking.
            </p>
          )}

          <select name="subjectId" value={booking.subjectId} onChange={handleChange} className="w-full border rounded-xl px-4 py-3" required>
            <option value="">Select subject</option>
            {subjects.map(s => (
              <option key={s.subject.id} value={s.subject.id}>
                {s.subject.name}
              </option>
            ))}
          </select>

          <input name="bookingDate" type="date" value={booking.bookingDate} onChange={handleChange} className="w-full border rounded-xl px-4 py-3" required />

          <div>
            <p className="text-sm text-purple-500 mb-2">Choose slot</p>
            <div className="flex flex-wrap gap-2">
              {availability.map(slot => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => handleSlotClick(slot)}
                  className={`px-3 py-2 rounded-xl text-sm border ${
                    booking.startTime === slot.startTime && booking.endTime === slot.endTime
                      ? 'bg-purple-500 text-white'
                      : 'bg-purple-50 text-purple-600'
                  }`}
                >
                  {slot.dayOfWeek}: {slot.startTime}-{slot.endTime}
                </button>
              ))}
            </div>
          </div>

          <textarea
            name="requestMessage"
            value={booking.requestMessage}
            onChange={handleChange}
            placeholder="What do you need help with?"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button disabled={user?.role !== 'student'} className="btn-primary w-full py-3">
            Request Booking
          </button>
        </form>
      </div>
    </div>
  )
}