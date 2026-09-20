import { Link, useLocation } from 'react-router-dom'
import { Dices, Radio, Trophy, Gamepad2, User, Menu } from 'lucide-react'

const ITEMS = [
  { key: 'casino',  label: 'Casino',  icon: Dices,     to: '/' },
  { key: 'live',    label: 'Live',    icon: Radio,     to: '/live' },
  { key: 'sports',  label: 'Sports',  icon: Trophy,    to: '/' },
  { key: 'esports', label: 'eSports', icon: Gamepad2,  to: '/' },
  { key: 'login',   label: 'Log in',  icon: User,      to: '/login' },
  { key: 'menu',    label: 'Menu',    icon: Menu,      to: '/help' },
]

export default function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0b1220] border-t border-[#1e2a44] z-30">
      <div className="grid grid-cols-6">
        {ITEMS.map(({ key, label, icon: Icon, to }) => {
          const active = pathname === to && (key === 'sports' || key === 'live')
          return (
            <Link
              key={key}
              to={to}
              className={`flex flex-col items-center justify-center py-2 transition-colors ${
                active ? 'text-[#ffb800]' : 'text-gray-400'
              }`}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-[10px] mt-0.5 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
