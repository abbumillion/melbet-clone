import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function MobileHeader() {
  const { isAuthed } = useAuth()

  return (
    <div className="md:hidden sticky top-0 z-30 bg-[#0b1220] border-b border-[#1e2a44]">
      <div className="flex items-center justify-between h-14 px-3">
        <Link to="/" className="select-none">
          <span className="text-xl font-black text-[#ffb800]">MEL</span>
          <span className="text-xl font-black text-white">BET</span>
        </Link>

        {isAuthed ? (
          <Link
            to="/settings"
            className="text-xs px-3 py-2 rounded font-semibold bg-[#1e2a44] text-white"
          >
            Account
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs px-3 py-2 rounded font-semibold bg-[#1e2a44] text-white"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-xs px-3 py-2 rounded font-semibold bg-[#ffb800] text-black"
            >
              Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
