import { Star } from 'lucide-react'

function statusText(match) {
  if (match.status === 'HT') return '/ Half-time'
  if (match.status === 'FT') return '/ Full-time'
  if (match.status === 'LIVE') return '/ ' + (match.period || 'Live')
  const t = new Date(match.startTime)
  return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function isLive(match) {
  return match.status === 'LIVE' || match.status === 'HT'
}

export default function MobileMatchCard({ match }) {
  const live = isLive(match)
  const hasScore = live || match.status === 'FT'

  return (
    <div className="bg-[#f4f5f7] text-black rounded-lg overflow-hidden mb-2">
      {/* League header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200">
        <span className="text-sm">⚽</span>
        <span className="text-xs font-semibold text-gray-700">
          {match.league}
        </span>
      </div>

      {/* Time / status row */}
      <div className="flex items-center justify-between px-3 py-1.5 text-[11px] text-gray-600">
        <div className="flex items-center gap-2">
          <span>{statusText(match)}</span>
          {match.minute > 0 && match.status === 'LIVE' && (
            <span className="text-gray-500">· {match.minute}'</span>
          )}
        </div>
        {live && (
          <span className="bg-[#ffb800] text-black text-[9px] font-bold px-1.5 py-0.5 rounded">
            LIVE
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="px-3 pb-2">
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 min-w-0">
            <Star size={11} className="text-gray-400 shrink-0" />
            <span className="text-sm font-medium text-black truncate">
              {match.homeTeam}
            </span>
          </div>
          {hasScore && (
            <span className="text-sm font-bold text-black">{match.homeScore}</span>
          )}
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 min-w-0">
            <Star size={11} className="text-gray-400 shrink-0" />
            <span className="text-sm font-medium text-gray-800 truncate">
              {match.awayTeam}
            </span>
          </div>
          {hasScore && (
            <span className="text-sm font-bold text-black">{match.awayScore}</span>
          )}
        </div>
      </div>

      {/* Round / info line */}
      <div className="px-3 pb-2 text-[10px] text-gray-500">
        {match.sport === 'FOOTBALL' && `Round ${(match.id % 10) + 1}`}
      </div>

      {/* Odds strip (revealed on tap on real Melbet — we show basic 1X2) */}
      <div className="bg-[#e4e6ea] px-2 py-1.5 grid grid-cols-3 gap-1">
        <button
          disabled={match.oddsSuspended}
          className="bg-white rounded h-8 text-xs font-semibold text-black hover:bg-[#ffb800] disabled:opacity-60"
        >
          {match.homeOdds?.toFixed(2) || '—'}
        </button>
        <button
          disabled={match.oddsSuspended || match.sport !== 'FOOTBALL'}
          className="bg-white rounded h-8 text-xs font-semibold text-black hover:bg-[#ffb800] disabled:opacity-60"
        >
          {match.sport === 'FOOTBALL' ? match.drawOdds?.toFixed(2) : '—'}
        </button>
        <button
          disabled={match.oddsSuspended}
          className="bg-white rounded h-8 text-xs font-semibold text-black hover:bg-[#ffb800] disabled:opacity-60"
        >
          {match.awayOdds?.toFixed(2) || '—'}
        </button>
      </div>
    </div>
  )
}
