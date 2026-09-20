import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await client.post('/auth/login', { email, password })
      login(data.token, data.email)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
        <h1 className="text-xl font-bold text-white">Login</h1>

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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#0b1220] border border-[#1e2a44] rounded px-3 py-2 text-white focus:outline-none focus:border-[#ffb800]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ffb800] hover:bg-[#ffc93a] text-black font-semibold py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-gray-400 text-center">
          No account?{' '}
          <Link to="/signup" className="text-[#ffb800] hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  )
}
