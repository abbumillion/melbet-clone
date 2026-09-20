import { Link, useNavigate } from 'react-router-dom'
import { Globe, ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'SPORTS',     to: '/' },
  { label: 'LIVE',       to: '/live', live: true },
  { label: 'FAST GAMES', to: '/' },
  { label: 'CASINO',     to: '/' },
  { label: 'LIVE CASINO',to: '/' },
  { label: 'ESPORTS',    to: '/' },
  { label: 'PROMOTIONS', to: '/' },
  { label: 'BINGO',      to: '/' },
  { label: 'MORE',       to: '/' },
]

export default function Header() {
  const { isAuthed, email, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="sticky top-0 z-30">
      {/* Top yellow bar */}
      <div className="bg-[#ffb800] text-black">
        <div className="flex items-center justify-between h-11 px-3">
          {/* Logo */}
          <Link to="/" className="flex items-end gap-0.5 select-none">
            <span className="text-2xl font-black tracking-tight">MEL</span>
            <span className="text-2xl font-black tracking-tight">BET</span>
          </Link>

          {/* Center mini-icons (decorative) */}
          <div className="hidden lg:flex items-center gap-1">
            {['🏔', '🎰', '🍎', '⚡', '🎁', '🎬'].map((e) => (
              <button
                key={e}
                className="w-8 h-8 rounded bg-[#1a1a1a]/10 hover:bg-black/10 text-base"
              >
                {e}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button className="hidden md:flex items-center gap-1 text-xs bg-black/10 hover:bg-black/20 rounded px-2 py-1.5">
              <Globe size={14} />
              <span>EN</span>
              <ChevronDown size={12} />
            </button>
            <span className="hidden md:inline text-xs font-medium">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            {isAuthed ? (
              <>
                <Link
                  to="/settings"
                  className="text-xs px-3 py-2 rounded font-semibold bg-black/10 hover:bg-black/20"
                >
                  {email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3 py-2 rounded font-semibold bg-black text-white hover:bg-gray-900"
                >
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-xs px-3 py-2 rounded font-bold bg-[#1a1a1a] text-[#ffb800] hover:bg-black"
                >
                  REGISTRATION
                </Link>
                <Link
                  to="/login"
                  className="text-xs px-3 py-2 rounded font-bold bg-[#1a1a1a] text-[#ffb800] hover:bg-black"
                >
                  LOG IN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dark nav strip */}
      <div className="bg-[#131d33] border-b border-[#1e2a44]">
        <div className="flex items-center gap-1 h-9 px-2 overflow-x-auto">
          <button className="p-2 text-gray-400 hover:text-white">
            <Menu size={16} />
          </button>
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold tracking-wide text-[#ffb800] hover:text-white whitespace-nowrap"
            >
              {item.live && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
              {item.label}
              <ChevronDown size={11} className="opacity-70" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
