// ── Spinner ──────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${s} border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin`} />
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}

// ── StatusBadge ──────────────────────────────────────────────────────────
const STATUS_STYLES = {
  requested:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  accepted:   'bg-green-100 text-green-700 border-green-200',
  rejected:   'bg-red-100 text-red-600 border-red-200',
  cancelled:  'bg-gray-100 text-gray-500 border-gray-200',
  completed:  'bg-purple-100 text-purple-700 border-purple-200',
}
export function StatusBadge({ status }) {
  return (
    <span className={`badge border ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-500'}`}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </span>
  )
}

// ── StarRating ───────────────────────────────────────────────────────────
export function StarRating({ rating = 0, max = 5, size = 'sm', interactive = false, onChange }) {
  const sz = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base'
  return (
    <div className={`flex gap-0.5 ${sz}`}>
      {Array.from({ length: max }, (_, i) => (
        <button key={i} type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(i + 1)}
          className={`${interactive ? 'hover:scale-125 transition-transform cursor-none' : 'cursor-default'} 
            ${i < Math.round(rating) ? 'text-yellow-500' : 'text-gray-200'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

// ── TutorCard ────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'

export function TutorCard({ tutor, onBook }) {
  const { user, bio, rate, experience, averageRating, totalSessionsCompleted, subjects, availability } = tutor
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="card group">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-syne font-bold text-purple-900 truncate">{user?.name}</h3>
          <p className="text-xs text-purple-400">{experience}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={averageRating || 0} />
            <span className="text-xs text-purple-400">({totalSessionsCompleted || 0} sessions)</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-syne font-bold text-purple-600 text-lg">₹{rate}/hr</div>
        </div>
      </div>

      {bio && <p className="text-sm text-purple-600 mb-3 line-clamp-2">{bio}</p>}

      {subjects?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {subjects.slice(0, 4).map(s => (
            <span key={s.subject?.id} className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
              {s.subject?.name}
            </span>
          ))}
          {subjects.length > 4 && <span className="text-xs text-purple-400">+{subjects.length - 4} more</span>}
        </div>
      )}

      {availability?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {[...new Set(availability.map(a => a.dayOfWeek))].map(day => (
            <span key={day} className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">{day.slice(0, 3)}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        <Link to={`/tutors/${user?.id}`}
          className="flex-1 text-center text-sm font-medium border border-purple-200 text-purple-600 rounded-xl py-2 hover:bg-purple-50 transition-colors">
          View Profile
        </Link>
        {onBook && (
          <button onClick={() => onBook(tutor)}
            className="flex-1 btn-primary text-sm py-2">
            Book Session
          </button>
        )}
      </div>
    </div>
  )
}

// ── BookingCard ──────────────────────────────────────────────────────────
export function BookingCard({ booking, currentUserRole, onAccept, onReject, onCancel, onComplete }) {
  const other = currentUserRole === 'student' ? booking.tutor : booking.student
  const otherLabel = currentUserRole === 'student' ? 'Tutor' : 'Student'
  const date = new Date(booking.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-purple-400 font-medium">{otherLabel}</div>
          <div className="font-syne font-bold text-purple-900">{other?.name}</div>
          <div className="text-sm text-purple-500">{booking.subject?.name}</div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-purple-600 mb-4">
        <div><span className="text-purple-400 text-xs block">Date</span>{date}</div>
        <div><span className="text-purple-400 text-xs block">Time</span>{booking.startTime} – {booking.endTime}</div>
      </div>

      {booking.requestMessage && (
        <div className="bg-purple-50 rounded-xl p-3 text-sm text-purple-600 mb-4 italic">
          "{booking.requestMessage}"
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Link to={`/bookings/${booking.id}`}
          className="text-sm font-medium border border-purple-200 text-purple-600 rounded-xl px-4 py-2 hover:bg-purple-50 transition-colors">
          View Details
        </Link>
        {currentUserRole === 'tutor' && booking.status === 'requested' && (
          <>
            <button onClick={() => onAccept?.(booking.id)}
              className="text-sm font-medium bg-green-500 text-white rounded-xl px-4 py-2 hover:bg-green-600 transition-colors">
              Accept
            </button>
            <button onClick={() => onReject?.(booking.id)}
              className="text-sm font-medium bg-red-100 text-red-500 rounded-xl px-4 py-2 hover:bg-red-200 transition-colors">
              Reject
            </button>
          </>
        )}
        {currentUserRole === 'tutor' && booking.status === 'accepted' && (
          <button onClick={() => onComplete?.(booking.id)}
            className="text-sm font-medium bg-purple-500 text-white rounded-xl px-4 py-2 hover:bg-purple-600 transition-colors">
            Mark Complete
          </button>
        )}
        {['requested', 'accepted'].includes(booking.status) && (
          <button onClick={() => onCancel?.(booking.id)}
            className="text-sm font-medium text-gray-400 hover:text-red-400 transition-colors px-2 py-2">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
