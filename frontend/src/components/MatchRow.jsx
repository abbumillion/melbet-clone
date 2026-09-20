function formatScore(match) {
  switch (match.sport) {
    case 'FOOTBALL':
    case 'BASKETBALL':
      return `${match.homeScore} - ${match.awayScore}`
    case 'TENNIS':
      return `${match.homeSets}-${match.awaySets} (${match.homeScore}-${match.awayScore})`
    case 'ESPORTS':
      return `${match.homeMaps}-${match.awayMaps}`
    case 'ATHLETICS':
      return match.status === 'FT' ? 'Finished' : 'Live'
    default:
      return `${match.homeScore} - ${match.awayScore}`
  }
}

function statusLabel(match) {
  if (match.status === 'HT') return 'HT'
  if (match.status === 'FT') return 'FT'
  if (match.status === 'LIVE') return match.period || 'LIVE'
  return new Date(match.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OddsButton({ label, value, suspended }) {
  return (
    <button
      disabled={suspended}
      className={`flex flex-col items-center justify-center w-[68px] h-[44px] rounded transition-colors ${
        suspended
          ? 'bg-[#1e2a44] text-gray-500 cursor-not-allowed'
          : 'bg-[#1e2a44] hover:bg-[#ffb800] hover:text-black text-white'
      }`}
    >
      <span className="text-[10px] opacity-70">{label}</span>
      <span className="text-sm font-semibold">{value.toFixed(2)}</span>
    </button>
  )
}

export default function MatchRow({ match }) {
  const isLive = match.status === 'LIVE' || match.status === 'HT'
  const showDraw = match.sport === 'FOOTBALL'

  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-2 border-b border-[#1a2440] hover:bg-[#131d33] transition-colors">
      {/* Left: teams + status */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={`shrink-0 w-14 text-center text-xs font-semibold px-2 py-1 rounded ${
            isLive ? 'bg-red-500/20 text-red-400' : 'bg-[#1e2a44] text-gray-400'
          }`}
        >
          {statusLabel(match)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm text-white truncate">
            <span className="truncate">{match.homeTeam}</span>
            {isLive && (
              <span className="text-xs font-bold text-[#ffb800]">
                {formatScore(match)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 truncate">
            <span className="truncate">{match.awayTeam}</span>
            {isLive && match.sport === 'TENNIS' && (
              <span className="text-xs text-gray-500">{match.period}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: odds */}
      <div className="flex items-center gap-2">
        <OddsButton label="1" value={match.homeOdds} suspended={match.oddsSuspended} />
        {showDraw && (
          <OddsButton label="X" value={match.drawOdds} suspended={match.oddsSuspended} />
        )}
        <OddsButton label="2" value={match.awayOdds} suspended={match.oddsSuspended} />
      </div>
    </div>
  )
}
