import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Settings, BookOpen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'SPORTS',      to: '/',         hasDropdown: true },
  { label: 'LIVE',        to: '/live',     hasDropdown: true, live: true },
  { label: 'FAST GAMES',  to: '/',         hasDropdown: true },
  { label: 'CASINO',      to: '/',         hasDropdown: true },
  { label: 'LIVE CASINO', to: '/',         hasDropdown: true },
  { label: 'ESPORTS',     to: '/',         hasDropdown: true },
  { label: 'PROMOTIONS',  to: '/',         hasDropdown: true },
  { label: 'BINGO',       to: '/',         hasDropdown: true },
  { label: 'MORE',        to: '/',         hasDropdown: true },
]

function useClock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  )
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 30_000)
    return () => clearInterval(t)
  }, [])
  return time
}

export default function Header() {
  const { isAuthed, email, logout } = useAuth()
  const navigate = useNavigate()
  const clock = useClock()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="sticky top-0 z-30">
      {/* ===== YELLOW BAR ===== */}
      <div className="bg-[#ffb800]">
        <div className="flex items-center justify-between h-[54px] px-3">
          {/* Logo */}
          <Link to="/" className="flex items-end select-none shrink-0 -ml-1">
            <span className="text-[26px] font-black tracking-tighter italic leading-none">
              <span className="text-black">MEL</span>
              <span className="text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.5)]">
                BET
              </span>
            </span>
          </Link>

          {/* Center icon pills */}
          <div className="hidden lg:flex items-center gap-1 ml-4">
            {[
              { icon: '🏔', title: 'Aviator' },
              { icon: '🎰', title: 'Slots' },
              { icon: '🍎', title: 'Promo' },
              { icon: '⚡', title: 'Fast' },
              { icon: '🎁', title: 'Bonus' },
              { icon: '🎬', title: 'Streams' },
            ].map((item) => (
              <button
                key={item.title}
                title={item.title}
                className="w-[30px] h-[30px] flex items-center justify-center rounded bg-[#1c1c1c]/85 hover:bg-black text-[13px] leading-none"
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Book icon */}
            <button className="hidden md:flex p-1.5 text-black hover:opacity-70">
              <BookOpen size={16} />
            </button>

            {isAuthed ? (
              <>
                <Link
                  to="/settings"
                  className="text-[11px] px-3 py-1.5 rounded font-bold bg-[#ffb800] border border-black text-black hover:bg-[#ffc93a] truncate max-w-[140px]"
                >
                  {email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[11px] px-3 py-1.5 rounded font-bold bg-black border border-black text-white hover:bg-[#1a1a1a]"
                >
                  LOG OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-[11px] px-3 py-1.5 rounded font-bold bg-[#ffb800] border border-black text-black hover:bg-[#ffc93a] whitespace-nowrap"
                >
                  REGISTRATION
                </Link>
                <Link
                  to="/login"
                  className="text-[11px] px-3 py-1.5 rounded font-bold bg-black border border-black text-white hover:bg-[#1a1a1a] whitespace-nowrap"
                >
                  LOG IN
                </Link>
              </>
            )}

            {/* Settings gear */}
            <button className="hidden md:flex p-1.5 text-black hover:opacity-70">
              <Settings size={16} />
            </button>

            {/* Language */}
            <button className="hidden md:flex items-center gap-1 text-xs text-black font-semibold px-1">
              <span className="text-sm leading-none">🇪🇹</span>
              <span>EN</span>
              <ChevronDown size={11} />
            </button>

            {/* Live clock with dropdown */}
            <button className="hidden md:flex items-center gap-0.5 text-[12px] text-black tabular-nums font-medium">
              <span>{clock}</span>
              <ChevronDown size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== DARK NAV STRIP ===== */}
      <div className="bg-black border-b border-[#2a2a2a] relative overflow-hidden">
        {/* Diagonal yellow accent */}
        <div
          className="absolute top-0 left-0 h-[3px] bg-[#ffb800]"
          style={{
            width: '200px',
            transform: 'skewX(-30deg)',
            transformOrigin: 'left',
          }}
        />
        <div className="flex items-center h-[44px] px-4">
          <div className="flex items-center gap-0.5 overflow-x-auto min-w-0">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-bold tracking-wide text-[#ffb800] hover:text-white whitespace-nowrap"
              >
                {item.live && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                )}
                {item.label}
                {item.hasDropdown && (
                  <ChevronDown size={12} className="opacity-80" />
                )}
              </Link>
            ))}
          </div>

          <a
            href="#"
            className="hidden xl:flex items-center gap-2 shrink-0 text-xs text-[#ffb800] hover:text-white ml-auto"
          >
            <span className="text-base">🎭</span>
            <span className="font-bold italic">Wild West Gold</span>
          </a>
        </div>
      </div>
    </div>
  )
}
