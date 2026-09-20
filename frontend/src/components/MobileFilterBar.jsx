import { Search, Star, Radio, Trophy } from 'lucide-react'

export default function MobileFilterBar({
  liveOnly, setLiveOnly,
  query, setQuery,
}) {
  return (
    <div className="md:hidden px-3 pb-2 space-y-2">
      {/* Tab row: LIVE | SPORTS | star */}
      <div className="flex gap-2">
        <button
          onClick={() => setLiveOnly(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            liveOnly
              ? 'bg-[#0f1a2e] border border-[#0ea5e9]/40 text-[#0ea5e9]'
              : 'bg-[#0f1a2e] border border-[#1e2a44] text-gray-300'
          }`}
        >
          <Radio size={13} />
          LIVE
        </button>
        <button
          onClick={() => setLiveOnly(false)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-colors ${
            !liveOnly
              ? 'bg-[#0f1a2e] border border-[#ffb800]/40 text-[#ffb800]'
              : 'bg-[#0f1a2e] border border-[#1e2a44] text-gray-300'
          }`}
        >
          <Trophy size={13} />
          SPORTS
        </button>
        <button className="w-11 flex items-center justify-center py-2.5 rounded-lg bg-[#0f1a2e] border border-[#1e2a44] text-[#ffb800]">
          <Star size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-[#0f1a2e] border border-[#1e2a44] rounded-lg h-10 px-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for matches, competitions..."
          className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
        />
        <Search size={16} className="text-gray-400" />
      </div>
    </div>
  )
}
