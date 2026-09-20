import {
  Home, Star, Clock, Trophy, Zap, DollarSign, Gift,
  Gamepad2, Dices, Tv, Radio, Target, Medal, Flag,
  Music, Film, Sparkles, TrendingUp, Users, Wallet,
  Settings, HelpCircle, Search, Heart, Bell,
} from 'lucide-react'

const ICONS = [
  { key: 'home',     icon: Home,        label: 'Home' },
  { key: 'star',     icon: Star,        label: 'Favorites' },
  { key: 'clock',    icon: Clock,       label: 'History' },
  { key: 'trophy',   icon: Trophy,      label: 'Top Events' },
  { key: 'zap',      icon: Zap,         label: 'Fast Games' },
  { key: 'dollar',   icon: DollarSign,  label: 'Deposit' },
  { key: 'gift',     icon: Gift,        label: 'Promotions' },
  { key: 'gamepad',  icon: Gamepad2,    label: 'eSports' },
  { key: 'dices',    icon: Dices,       label: 'Casino' },
  { key: 'tv',       icon: Tv,          label: 'Live Casino' },
  { key: 'radio',    icon: Radio,       label: 'Live' },
  { key: 'target',   icon: Target,      label: 'Bets' },
  { key: 'medal',    icon: Medal,       label: 'Leaderboard' },
  { key: 'flag',     icon: Flag,        label: 'Sports' },
  { key: 'music',    icon: Music,       label: 'Music' },
  { key: 'film',     icon: Film,        label: 'Streams' },
  { key: 'sparkle',  icon: Sparkles,    label: 'Bonus' },
  { key: 'trend',    icon: TrendingUp,  label: 'Trending' },
  { key: 'users',    icon: Users,       label: 'Referrals' },
  { key: 'wallet',   icon: Wallet,      label: 'Wallet' },
  { key: 'search',   icon: Search,      label: 'Search' },
  { key: 'heart',    icon: Heart,       label: 'Liked' },
  { key: 'bell',     icon: Bell,        label: 'Alerts' },
  { key: 'help',     icon: HelpCircle,  label: 'Help' },
  { key: 'settings', icon: Settings,    label: 'Settings' },
]

export default function IconRail({ active, onChange }) {
  return (
    <aside className="w-12 shrink-0 bg-[#0a1122] border-r border-[#1e2a44] sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
      {ICONS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          title={label}
          onClick={() => onChange?.(key)}
          className={`w-full flex items-center justify-center h-10 transition-colors ${
            active === key
              ? 'text-[#ffb800] bg-[#131d33] border-l-2 border-[#ffb800]'
              : 'text-gray-500 hover:text-white hover:bg-[#131d33] border-l-2 border-transparent'
          }`}
        >
          <Icon size={18} strokeWidth={1.8} />
        </button>
      ))}
    </aside>
  )
}
