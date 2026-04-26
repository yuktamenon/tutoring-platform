import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: params.get('role') || 'student'
  })

  const handleChange = (e) => {
    clearError()
    setSuccess('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form)

    if (result.success) {
      setSuccess('Account created successfully. Please login.')
      setTimeout(() => navigate('/login'), 900)
    }
  }

  return (
    <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="font-syne text-3xl font-extrabold text-purple-900 mb-2">
          Create account
        </h1>
        <p className="text-purple-500 mb-6">
          Join as a student or tutor.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 border border-red-100 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 border border-green-100 rounded-xl px-4 py-3 text-sm mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-purple-100 rounded-xl px-4 py-3 outline-none focus:border-purple-400"
          >
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-purple-500 mt-5 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}