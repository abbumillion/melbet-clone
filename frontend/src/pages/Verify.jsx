import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Verify() {
  const [params] = useSearchParams()
  const [email, setEmail] = useState(params.get('email') || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await client.post('/auth/verify', { email, code })
      login(data.token, data.email)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
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
        <h1 className="text-xl font-bold text-white">Verify your email</h1>
        <p className="text-sm text-gray-400">
          We logged a 6-digit code to the backend console. Paste it below.
        </p>

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
          type="text"
          required
          maxLength={6}
          placeholder="6-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-[#0b1220] border border-[#1e2a44] rounded px-3 py-2 text-white text-center tracking-widest text-lg focus:outline-none focus:border-[#ffb800]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#ffb800] hover:bg-[#ffc93a] text-black font-semibold py-2 rounded disabled:opacity-60"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  )
}
