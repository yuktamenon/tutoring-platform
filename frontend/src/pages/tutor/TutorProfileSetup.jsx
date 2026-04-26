import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createTutorProfile, getTutorProfile } from '../../api/tutorApi'

export default function TutorProfileSetup() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({
    bio: '',
    rate: '',
    experience: ''
  })

  useEffect(() => {
    getTutorProfile(user.id)
      .then(res => {
        setProfile(res.data)
        setForm({
          bio: res.data.bio || '',
          rate: res.data.rate || '',
          experience: res.data.experience || ''
        })
      })
      .catch(() => {})
  }, [user.id])

  const handleChange = (e) => {
    setMessage('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await createTutorProfile({
        bio: form.bio,
        rate: Number(form.rate),
        experience: form.experience
      })
      setProfile(res.data.profile)
      setMessage('Tutor profile saved successfully.')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not save profile.')
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto">
      <h1 className="font-syne text-4xl font-extrabold text-purple-900 mb-2">
        Tutor Profile
      </h1>
      <p className="text-purple-500 mb-8">
        Set up your tutor details so students can find you.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        {message && <div className="text-sm text-purple-600">{message}</div>}

        <textarea
          name="bio"
          placeholder="Short bio"
          value={form.bio}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 min-h-28"
          required
        />

        <input
          name="rate"
          type="number"
          placeholder="Hourly rate"
          value={form.rate}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
          required
        />

        <input
          name="experience"
          placeholder="Experience level / description"
          value={form.experience}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
          required
        />

        <button className="btn-primary px-6 py-3">
          {profile ? 'Profile Already Created' : 'Create Profile'}
        </button>

        {profile && (
          <p className="text-sm text-yellow-700 bg-yellow-50 rounded-xl px-4 py-3">
            If your backend does not support updating profiles yet, this form can only create once.
          </p>
        )}
      </form>
    </div>
  )
}