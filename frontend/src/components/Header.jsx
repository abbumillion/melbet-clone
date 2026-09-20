import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthed, email, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-[#0f1a2e] border-b border-[#1e2a44] sticky top-0 z-20">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#ffb800]">MEL</span>
            <span className="text-2xl font-black text-white">BET</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-white">Sports</Link>
            <Link to="/live" className="hover:text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live
            </Link>
            <Link to="/help" className="hover:text-white">Help</Link>
            <Link to="/about" className="hover:text-white">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <Link
                to="/settings"
                className="text-sm text-gray-300 hover:text-white"
              >
                {email}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded bg-[#1e2a44] hover:bg-[#2a3a5c] text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm px-4 py-2 rounded border border-[#2a3a5c] text-white hover:bg-[#1e2a44]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm px-4 py-2 rounded bg-[#ffb800] text-black font-semibold hover:bg-[#ffc93a]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
