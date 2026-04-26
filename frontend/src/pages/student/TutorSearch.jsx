import { useEffect, useState } from 'react'
import { searchTutors } from '../../api/tutorApi'
import { getSubjects } from '../../api/subjectApi'
import { TutorCard } from '../../components/shared/UI'
import { useNavigate } from 'react-router-dom'

export default function TutorSearch() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [tutors, setTutors] = useState([])
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState({
    subject: '',
    minRate: '',
    maxRate: '',
    minRating: '',
    dayOfWeek: ''
  })

  useEffect(() => {
    getSubjects()
      .then(res => setSubjects(res.data.subjects || res.data || []))
      .catch(console.error)

    loadTutors()
  }, [])

  async function loadTutors(params = {}) {
    setLoading(true)
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== '')
      )
      const res = await searchTutors(cleanParams)
      setTutors(res.data.tutors || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    loadTutors(filters)
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-6xl mx-auto">
      <h1 className="font-syne text-4xl font-extrabold text-purple-900 mb-2">
        Find Tutors
      </h1>
      <p className="text-purple-500 mb-8">
        Search by subject, rate, rating, or availability.
      </p>

      <form onSubmit={handleSubmit} className="card mb-8 grid md:grid-cols-5 gap-4">
        <select name="subject" value={filters.subject} onChange={handleChange} className="border rounded-xl px-3 py-3">
          <option value="">All Subjects</option>
          {subjects.map(s => (
            <option key={s.id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <input name="minRate" type="number" placeholder="Min rate" value={filters.minRate} onChange={handleChange} className="border rounded-xl px-3 py-3" />
        <input name="maxRate" type="number" placeholder="Max rate" value={filters.maxRate} onChange={handleChange} className="border rounded-xl px-3 py-3" />

        <select name="dayOfWeek" value={filters.dayOfWeek} onChange={handleChange} className="border rounded-xl px-3 py-3">
          <option value="">Any Day</option>
          {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <button className="btn-primary py-3">Search</button>
      </form>

      {loading ? (
        <p className="text-purple-500">Searching tutors...</p>
      ) : tutors.length === 0 ? (
        <div className="card text-purple-500">No tutors found.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-5">
          {tutors.map(tutor => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onBook={() => navigate(`/tutors/${tutor.user.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}