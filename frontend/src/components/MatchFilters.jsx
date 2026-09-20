import { useState } from 'react'
import { Search, ChevronDown } from 'lucide-react'

const TABS = ['Matches', 'Recommended', 'Upcoming events', '1st period', '2nd period']

const SPORTS = [
  { key: 'ALL',        label: 'All',        emoji: '🏆' },
  { key: 'FOOTBALL',   label: 'Football',   emoji: '⚽' },
  { key: 'TENNIS',     label: 'Tennis',     emoji: '🎾' },
  { key: 'BASKETBALL', label: 'Basketball', emoji: '🏀' },
  { key: 'ESPORTS',    label: 'eSports',    emoji: '🎮' },
  { key: 'ATHLETICS',  label: 'Athletics',  emoji: '🏃' },
]

export default function MatchFilters({
  tab, setTab,
  sport, setSport,
  liveOnly, setLiveOnly,
  query, setQuery,
}) {
  const [expandedSports, setExpandedSports] = useState(false)
  const visibleSports = expandedSports ? SPORTS : SPORTS.slice(0, 6)

  return (
    <div className="bg-[#0f1a2e] border-b border-[#1e2a44]">
      {/* Tabs row */}
      <div className="flex items-center justify-between px-3 h-10 border-b border-[#1e2a44]">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button className="p-1.5 text-gray-400 hover:text-white">
            <span className="text-sm">🏠</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white">
            <span className="text-sm">⚽</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white">
            <span className="text-sm">🏆</span>
          </button>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs whitespace-nowrap ${
                tab === t
                  ? 'text-white font-semibold border-b-2 border-[#ffb800]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center bg-[#0b1220] border border-[#1e2a44] rounded px-2 h-7 w-48">
            <Search size={13} className="text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by match"
              className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 outline-none ml-1.5"
            />
          </div>
        </div>
      </div>

      {/* Filter strip */}
      <div className="flex items-center gap-2 px-3 h-10 overflow-x-auto">
        <label className="flex items-center gap-1.5 cursor-pointer select-none">
          <div
            onClick={() => setLiveOnly(!liveOnly)}
            className={`w-8 h-4 rounded-full transition-colors relative ${
              liveOnly ? 'bg-[#ffb800]' : 'bg-[#2a3a5c]'
            }`}
          >
            <div
              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                liveOnly ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </div>
          <span className="text-xs text-gray-300 whitespace-nowrap">
            With live streams
          </span>
        </label>

        {visibleSports.map((s) => (
          <button
            key={s.key}
            onClick={() => setSport(s.key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors ${
              sport === s.key
                ? 'bg-[#ffb800] text-black font-semibold'
                : 'text-gray-300 hover:text-white hover:bg-[#1e2a44]'
            }`}
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}

        <button
          onClick={() => setExpandedSports((v) => !v)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white"
        >
          <span className="w-5 h-5 flex items-center justify-center bg-[#1e2a44] rounded">
            <ChevronDown size={12} />
          </span>
        </button>
      </div>
    </div>
  )
}
