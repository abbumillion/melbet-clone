import { useState } from 'react'
import MatchRow from './MatchRow'

export default function LeagueSection({ league, matches }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-4 bg-[#0f1a2e] rounded-lg border border-[#1e2a44] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#132040] hover:bg-[#182a52] transition-colors"
      >
        <span className="text-sm font-semibold text-white">{league}</span>
        <span className="text-xs text-gray-400">
          {matches.length} {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <div>
          {matches.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}
