import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getSubjects, createSubject } from '../../api/subjectApi'
import { assignSubjectToTutor, getTutorProfile, getTutorSubjects } from '../../api/tutorApi'

export default function ManageSubjects() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [mySubjects, setMySubjects] = useState([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [newSubject, setNewSubject] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const profileRes = await getTutorProfile(user.id)
      setProfile(profileRes.data)

      const subjectsRes = await getSubjects()
      setSubjects(subjectsRes.data.subjects || subjectsRes.data || [])

      const tutorSubjectRes = await getTutorSubjects(profileRes.data.id)
      setMySubjects(tutorSubjectRes.data.tutorSubjects || [])
    } catch (err) {
      setMessage('Create your tutor profile first.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreateSubject = async (e) => {
    e.preventDefault()
    if (!newSubject.trim()) return

    try {
      await createSubject({ name: newSubject })
      setNewSubject('')
      load()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not create subject.')
    }
  }

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!profile || !selectedSubjectId) return

    try {
      await assignSubjectToTutor({
        tutorId: profile.id,
        subjectId: Number(selectedSubjectId)
      })
      setSelectedSubjectId('')
      setMessage('Subject assigned successfully.')
      load()
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not assign subject.')
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto">
      <h1 className="font-syne text-4xl font-extrabold text-purple-900 mb-8">
        Manage Subjects
      </h1>

      {message && <div className="card mb-5 text-purple-600">{message}</div>}

      <div className="grid md:grid-cols-2 gap-5">
        <form onSubmit={handleAssign} className="card space-y-4">
          <h2 className="font-syne text-xl font-bold text-purple-900">Assign Subject</h2>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
          >
            <option value="">Select subject</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button className="btn-primary px-6 py-3">Assign</button>
        </form>

        <form onSubmit={handleCreateSubject} className="card space-y-4">
          <h2 className="font-syne text-xl font-bold text-purple-900">Create Subject</h2>

          <input
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Example: Operating Systems"
            className="w-full border rounded-xl px-4 py-3"
          />

          <button className="btn-secondary px-6 py-3">Create Subject</button>
        </form>
      </div>

      <div className="card mt-5">
        <h2 className="font-syne text-xl font-bold text-purple-900 mb-3">My Subjects</h2>

        {mySubjects.length === 0 ? (
          <p className="text-purple-500">No subjects assigned yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {mySubjects.map(item => (
              <span key={item.id} className="bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-sm">
                {item.subject.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}