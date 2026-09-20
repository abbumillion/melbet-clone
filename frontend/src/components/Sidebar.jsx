const SPORTS = [
  { key: 'ALL',        label: 'All Sports',  icon: '🎯' },
  { key: 'FOOTBALL',   label: 'Football',    icon: '⚽' },
  { key: 'BASKETBALL', label: 'Basketball',  icon: '🏀' },
  { key: 'TENNIS',     label: 'Tennis',      icon: '🎾' },
  { key: 'ATHLETICS',  label: 'Athletics',   icon: '🏃' },
  { key: 'ESPORTS',    label: 'eSports',     icon: '🎮' },
]

export default function Sidebar({ selected, onChange }) {
  return (
    <aside className="w-56 shrink-0 bg-[#0f1a2e] border-r border-[#1e2a44] min-h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="py-3">
        <div className="px-4 pb-2 text-xs uppercase tracking-wider text-gray-500">
          Sports
        </div>
        {SPORTS.map((s) => (
          <button
            key={s.key}
            onClick={() => onChange(s.key)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left transition-colors ${
              selected === s.key
                ? 'bg-[#1e2a44] text-white border-l-2 border-[#ffb800]'
                : 'text-gray-300 hover:bg-[#16203a] hover:text-white border-l-2 border-transparent'
            }`}
          >
            <span className="text-base">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
