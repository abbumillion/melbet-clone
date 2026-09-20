import { Star, BarChart2, Lock } from 'lucide-react'

function statusText(match) {
  if (match.status === 'HT') return 'HT'
  if (match.status === 'FT') return 'FT'
  if (match.status === 'LIVE') return match.period || 'LIVE'
  return new Date(match.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isLive(match) {
  return match.status === 'LIVE' || match.status === 'HT'
}

function OddsCell({ label, value, suspended, disabled }) {
  const locked = suspended || value == null || disabled
  return (
    <div className="flex-1 min-w-0 px-1">
      <div className="flex flex-col items-center">
        <span className="text-[9px] text-gray-500 uppercase leading-none mb-0.5">
          {label}
        </span>
        <button
          disabled={locked}
          className={`w-full h-7 rounded text-xs font-semibold transition-colors ${
            locked
              ? 'bg-[#141d33] text-gray-600 cursor-not-allowed'
              : 'bg-[#1e2a44] hover:bg-[#ffb800] hover:text-black text-white'
          }`}
        >
          {locked ? <Lock size={11} className="mx-auto" /> : value.toFixed(2)}
        </button>
      </div>
    </div>
  )
}

export default function MatchRow({ match }) {
  const live = isLive(match)
  const isFootball = match.sport === 'FOOTBALL'

  // Derived odds — approximate from the three we have
  const h = match.homeOdds
  const d = match.drawOdds
  const a = match.awayOdds
  const oneX = 1 / ((1 / h) + (1 / d))
  const oneTwo = 1 / ((1 / h) + (1 / a))
  const twoX = 1 / ((1 / d) + (1 / a))

  return (
    <div className="border-b border-[#1a2440] hover:bg-[#131d33] transition-colors">
      {/* Header row: kickoff / score / column labels */}
      <div className="grid grid-cols-[minmax(240px,1fr)_80px_44px_44px_44px_44px_44px_44px_44px] items-center gap-1 px-3 py-1.5 bg-[#0f1a2e] border-b border-[#16203a] text-[10px] text-gray-500">
        <div className="flex items-center gap-2">
          <Star size={11} className="text-gray-600" />
          <span className="uppercase tracking-wider">{match.league}</span>
        </div>
        <div />
        <div className="text-center">1</div>
        <div className="text-center">X</div>
        <div className="text-center">2</div>
        <div className="text-center">1X</div>
        <div className="text-center">12</div>
        <div className="text-center">2X</div>
        <div className="text-center">+5</div>
      </div>

      {/* Teams + odds */}
      <div className="grid grid-cols-[minmax(240px,1fr)_80px_44px_44px_44px_44px_44px_44px_44px] items-center gap-1 px-3 py-2">
        {/* Teams column */}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                live
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-[#1e2a44] text-gray-400'
              }`}
            >
              {statusText(match)}
            </span>
            <span className="text-sm text-white truncate">{match.homeTeam}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="shrink-0 w-9" />
            <span className="text-sm text-gray-300 truncate">{match.awayTeam}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
            <BarChart2 size={10} />
            <span>{match.sport}</span>
          </div>
        </div>

        {/* Score column */}
        <div className="flex flex-col items-center text-sm font-bold text-[#ffb800] leading-tight">
          {live || match.status === 'FT' ? (
            <>
              <span>{match.homeScore}</span>
              <span>{match.awayScore}</span>
            </>
          ) : (
            <span className="text-gray-600">—</span>
          )}
        </div>

        {/* Odds cells */}
        <OddsCell label="1"  value={h}      suspended={match.oddsSuspended} />
        <OddsCell label="X"  value={d}      suspended={match.oddsSuspended} disabled={!isFootball} />
        <OddsCell label="2"  value={a}      suspended={match.oddsSuspended} />
        <OddsCell label="1X" value={oneX}   suspended={match.oddsSuspended} disabled={!isFootball} />
        <OddsCell label="12" value={oneTwo} suspended={match.oddsSuspended} />
        <OddsCell label="2X" value={twoX}   suspended={match.oddsSuspended} disabled={!isFootball} />
        <OddsCell label="+5" value={null}   suspended={true} />
      </div>
    </div>
  )
}
