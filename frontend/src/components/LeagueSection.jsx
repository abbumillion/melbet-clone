import { useState } from 'react'
import { ChevronDown, ChevronRight, Star } from 'lucide-react'
import MatchRow from './MatchRow'

export default function LeagueSection({ league, matches, sportEmoji = '⚽' }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white border-b border-[#d8dae0]">
      {/* League header — light gray, dark text */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#e4e6ea] hover:bg-[#d8dae0] transition-colors border-b border-[#d8dae0]"
      >
        <div className="flex items-center gap-2">
          <span className="text-base">{sportEmoji}</span>
          <span className="text-sm font-semibold text-black">{league}</span>
          <span className="text-xs text-gray-600">({matches.length})</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Star size={13} />
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
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
