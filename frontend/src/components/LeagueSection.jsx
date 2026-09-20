import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import MatchRow from './MatchRow'

export default function LeagueSection({ league, matches }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="mb-1 bg-[#0f1a2e] border-b border-[#1e2a44]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#0f1a2e] hover:bg-[#131d33] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">⚽</span>
          <span className="text-sm font-semibold text-white">{league}</span>
          <span className="text-xs text-gray-500">({matches.length})</span>
        </div>
        <span className="text-gray-500">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>
      {open && (
        <div className="border-t border-[#1e2a44]">
          {matches.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}
