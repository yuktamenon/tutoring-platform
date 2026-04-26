import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getTutorProfile } from '../../api/tutorApi'
import { createAvailabilitySlot, getTutorAvailability, deleteAvailabilitySlot } from '../../api/availabilityApi'

export default function ManageAvailability() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [slots, setSlots] = useState([])
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    dayOfWeek: 'Monday',
    startTime: '',
    endTime: ''
  })

  const load = async () => {
    try {
      const profileRes = await getTutorProfile(user.id)
      setProfile(profileRes.data)

      const slotRes = await getTutorAvailability(profileRes.data.id)
      setSlots(slotRes.data.slots || [])
    } catch (err) {
      setMessage('Create your tutor profile first.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (e) => {
    setMessage('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!profile) return

    try {
      await createAvailabilitySlot({
        tutorId: profile.id,
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime
      })

      setForm({ dayOfWeek: 'Monday', startTime: '', endTime: '' })
      setMessage('Availability added successfully.')
      load()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not add availability.')
    }
  }

  const handleDelete = async (slotId) => {
    await deleteAvailabilitySlot(slotId)
    load()
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="font-syne text-4xl font-extrabold text-purple-900 mb-8">
        Manage Availability
      </h1>

      {message && <div className="card mb-5 text-purple-600">{message}</div>}

      <form onSubmit={handleSubmit} className="card grid md:grid-cols-4 gap-4 mb-6">
        <select name="dayOfWeek" value={form.dayOfWeek} onChange={handleChange} className="border rounded-xl px-4 py-3">
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <input name="startTime" type="time" value={form.startTime} onChange={handleChange} className="border rounded-xl px-4 py-3" required />
        <input name="endTime" type="time" value={form.endTime} onChange={handleChange} className="border rounded-xl px-4 py-3" required />

        <button className="btn-primary px-6 py-3">Add Slot</button>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {slots.length === 0 ? (
          <div className="card text-purple-500">No availability slots yet.</div>
        ) : (
          slots.map(slot => (
            <div key={slot.id} className="card flex justify-between items-center">
              <div>
                <div className="font-syne font-bold text-purple-900">{slot.dayOfWeek}</div>
                <div className="text-purple-500">{slot.startTime} – {slot.endTime}</div>
              </div>
              <button onClick={() => handleDelete(slot.id)} className="text-red-400 font-semibold">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}