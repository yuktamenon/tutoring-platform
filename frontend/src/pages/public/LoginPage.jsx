import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    clearError()
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(form)
  }

  return (
    <div className="min-h-screen pt-28 px-4 flex items-center justify-center">
      <div className="card w-full max-w-md">
        <h1 className="font-syne text-3xl font-extrabold text-purple-900 mb-2">
          Welcome back
        </h1>
        <p className="text-purple-500 mb-6">
          Login to continue your StudyBudee journey.
        </p>

        {error && (
          <div className="bg-red-50 text-red-500 border border-red-100 rounded-xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-purple-500 mt-5 text-center">
          New here?{' '}
          <Link to="/register" className="text-purple-700 font-semibold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}