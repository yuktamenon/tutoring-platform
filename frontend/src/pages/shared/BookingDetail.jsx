import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getStudentBookings, getTutorBookings } from '../../api/bookingApi'
import { getMessagesByBooking, sendMessage } from '../../api/messageApi'
import { createReview } from '../../api/reviewApi'
import { StatusBadge, StarRating } from '../../components/shared/UI'

export default function BookingDetail() {
  const { bookingId } = useParams()
  const { user } = useAuth()

  const [booking, setBooking] = useState(null)
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')
  const [review, setReview] = useState({
    rating: 5,
    feedback: ''
  })
  const [notice, setNotice] = useState('')

  const load = async () => {
    try {
      const bookingRes =
        user.role === 'student'
          ? await getStudentBookings(user.id)
          : await getTutorBookings(user.id)

      const found = (bookingRes.data.bookings || []).find(b => b.id === Number(bookingId))
      setBooking(found || null)

      const msgRes = await getMessagesByBooking(bookingId)
      setMessages(msgRes.data.messages || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    load()
  }, [bookingId])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    await sendMessage({
      bookingId: Number(bookingId),
      content
    })

    setContent('')
    load()
  }

  const handleReview = async (e) => {
    e.preventDefault()

    try {
      await createReview({
        bookingId: Number(bookingId),
        rating: Number(review.rating),
        feedback: review.feedback
      })

      setNotice('Review submitted successfully.')
      setReview({ rating: 5, feedback: '' })
    } catch (err) {
      setNotice(err.response?.data?.message || 'Could not submit review.')
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
        <div className="card text-purple-500">Booking not found.</div>
      </div>
    )
  }

  const other = user.role === 'student' ? booking.tutor : booking.student

  return (
    <div className="min-h-screen pt-24 px-4 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-5">
          <div className="card">
            <div className="flex justify-between items-start mb-4">
              <h1 className="font-syne text-2xl font-bold text-purple-900">
                Booking #{booking.id}
              </h1>
              <StatusBadge status={booking.status} />
            </div>

            <p className="text-purple-500 text-sm">With</p>
            <p className="font-bold text-purple-900">{other?.name}</p>

            <div className="mt-4 text-sm text-purple-600 space-y-2">
              <p><strong>Subject:</strong> {booking.subject?.name}</p>
              <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.startTime} – {booking.endTime}</p>
            </div>
          </div>

          {user.role === 'student' && booking.status === 'completed' && (
            <form onSubmit={handleReview} className="card space-y-4">
              <h2 className="font-syne text-xl font-bold text-purple-900">Leave Review</h2>

              {notice && <p className="text-sm text-purple-600">{notice}</p>}

              <StarRating
                rating={review.rating}
                interactive
                size="lg"
                onChange={(value) => setReview({ ...review, rating: value })}
              />

              <textarea
                value={review.feedback}
                onChange={(e) => setReview({ ...review, feedback: e.target.value })}
                placeholder="Write feedback"
                className="w-full border rounded-xl px-4 py-3"
              />

              <button className="btn-primary px-6 py-3">Submit Review</button>
            </form>
          )}
        </div>

        <div className="lg:col-span-2 card">
          <h2 className="font-syne text-2xl font-bold text-purple-900 mb-5">
            Booking Chat
          </h2>

          <div className="h-[420px] overflow-y-auto space-y-3 bg-purple-50 rounded-2xl p-4 mb-4">
            {messages.length === 0 ? (
              <p className="text-purple-400">No messages yet.</p>
            ) : (
              messages.map(m => {
                const mine = m.senderId === user.id
                return (
                  <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      mine ? 'bg-purple-500 text-white' : 'bg-white text-purple-700'
                    }`}>
                      <p>{m.content}</p>
                      <p className="text-[10px] opacity-70 mt-1">{m.sender?.name}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded-xl px-4 py-3"
            />
            <button className="btn-primary px-6">Send</button>
          </form>
        </div>
      </div>
    </div>
  )
}