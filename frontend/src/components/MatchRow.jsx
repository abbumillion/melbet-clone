import { Star } from 'lucide-react'
import MobileMatchCard from './MobileMatchCard'

function statusText(match) {
  if (match.status === 'HT') return 'HT'
  if (match.status === 'FT') return 'FT'
  if (match.status === 'LIVE') return match.period || 'LIVE'
  const t = new Date(match.startTime)
  return `${t.toLocaleDateString([], { day: '2-digit', month: '2-digit' })} ${t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

function isLive(match) {
  return match.status === 'LIVE' || match.status === 'HT'
}

function OddButton({ value, suspended }) {
  const locked = suspended || value == null
  return (
    <button
      disabled={locked}
      className={`w-full h-8 rounded text-xs font-semibold transition-colors ${
        locked
          ? 'bg-[#e4e6ea] text-gray-400 cursor-not-allowed'
          : 'bg-[#e8eaef] hover:bg-[#ffb800] text-black'
      }`}
    >
      {locked ? '' : value.toFixed(2)}
    </button>
  )
}

export default function MatchRow({ match }) {
  const live = isLive(match)
  const isFootball = match.sport === 'FOOTBALL'
  const hasScore = live || match.status === 'FT'

  const h = match.homeOdds
  const d = match.drawOdds
  const a = match.awayOdds
  const oneX = 1 / ((1 / h) + (1 / d))
  const oneTwo = 1 / ((1 / h) + (1 / a))
  const twoX = 1 / ((1 / d) + (1 / a))

  return (
    <>
      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden">
        <MobileMatchCard match={match} />
      </div>

      {/* ---------- DESKTOP: Melbet light rows ---------- */}
      <div className="hidden md:block bg-[#f0f1f4] border-b border-[#d8dae0]">
        {/* Header strip */}
        <div className="grid grid-cols-[110px_minmax(180px,1fr)_52px_64px_64px_64px_64px_64px_64px_64px] gap-1 items-center px-3 py-1 text-[10px] text-gray-500 bg-[#f0f1f4]">
          <div />
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-gray-400" />
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

        {/* Match row */}
        <div className="grid grid-cols-[110px_minmax(180px,1fr)_52px_64px_64px_64px_64px_64px_64px_64px] gap-1 items-center px-3 py-2">
          {/* Date / status */}
          <div className="text-[11px] text-gray-600 leading-tight">
            {live ? (
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-600">
                {statusText(match)}
              </span>
            ) : (
              <span>{statusText(match)}</span>
            )}
          </div>

          {/* Teams stacked */}
          <div className="min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Star size={12} className="text-gray-400 shrink-0" />
              <span className="text-sm text-black truncate">{match.homeTeam}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{match.awayTeam}</span>
            </div>
          </div>

          {/* Score */}
          <div className="text-center text-sm font-bold text-black leading-tight">
            {hasScore ? (
              <>
                <div>{match.homeScore}</div>
                <div>{match.awayScore}</div>
              </>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </div>

          <OddButton value={h}      suspended={match.oddsSuspended} />
          <OddButton value={d}      suspended={match.oddsSuspended || !isFootball} />
          <OddButton value={a}      suspended={match.oddsSuspended} />
          <OddButton value={oneX}   suspended={match.oddsSuspended || !isFootball} />
          <OddButton value={oneTwo} suspended={match.oddsSuspended} />
          <OddButton value={twoX}   suspended={match.oddsSuspended || !isFootball} />

          {/* +5 more */}
                    <button className="w-full h-8 rounded bg-[#e8eaef] hover:bg-[#d8dae0] text-black text-[10px] font-bold">
            +{(match.id * 7) % 150 + 30}
          </button>
        </div>
      </div>
    </>
  )
}
