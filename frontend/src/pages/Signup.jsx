import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import client from '../api/client'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await client.post('/auth/register', { email, password })
      navigate(`/verify?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-[#0f1a2e] border border-[#1e2a44] rounded-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-white">Create account</h1>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </div>
        )}

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#0b1220] border border-[#1e2a44] rounded px-3 py-2 text-white focus:outline-none focus:border-[#ffb800]"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="Password (min 8 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0b1220] border border-[#1e2a44] rounded px-3 py-2 text-white focus:outline-none focus:border-[#ffb800]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ffb800] hover:bg-[#ffc93a] text-black font-semibold py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Sign up'}
        </button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ffb800] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
