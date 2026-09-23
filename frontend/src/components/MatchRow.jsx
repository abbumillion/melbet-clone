import { Star, BarChart2, Lock, Tv, Activity } from 'lucide-react'
import MobileMatchCard from './MobileMatchCard'
import { useBetSlip } from '../context/BetSlipContext'

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

// Column config per sport
function getColumns(sport) {
  if (sport === 'FOOTBALL') {
    return [
      { key: '1',  label: '1' },
      { key: 'X',  label: 'X' },
      { key: '2',  label: '2' },
      { key: '1X', label: '1X' },
      { key: '12', label: '12' },
      { key: '2X', label: '2X' },
      { key: 'MORE', label: '+5' },
    ]
  }
  // Basketball, Tennis, Hockey, Volleyball, eSports
  return [
    { key: '1',     label: '1' },
    { key: 'X',     label: 'X' },
    { key: '2',     label: '2' },
    { key: 'O',     label: 'O' },
    { key: 'TOTAL', label: 'Total' },
    { key: 'U',     label: 'U' },
    { key: 'MORE',  label: '+3' },
  ]
}

function OddButton({ match, type, value, suspended }) {
  const { addSelection, removeSelection, isSelected } = useBetSlip()
  const locked = suspended || value == null
  const selected = isSelected(match.id, type)

  const handleClick = () => {
    if (locked) return
    if (selected) {
      removeSelection(match.id)
    } else {
      addSelection({
        matchId: match.id,
        type,
        odds: value,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        league: match.league,
        sport: match.sport,
      })
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={locked}
      className={`w-full h-8 rounded text-xs font-semibold transition-colors ${
        locked
          ? 'bg-[#e4e6ea] text-gray-400 cursor-not-allowed'
          : selected
          ? 'bg-[#ffb800] text-black font-bold'
          : 'bg-[#e8eaef] hover:bg-[#ffb800] hover:text-black text-black'
      }`}
    >
      {locked ? '' : value.toFixed(2)}
    </button>
  )
}

export default function MatchRow({ match }) {
  const live = isLive(match)
  const hasScore = live || match.status === 'FT'
  const cols = getColumns(match.sport)

  const h = match.homeOdds
  const d = match.drawOdds
  const a = match.awayOdds
  const oneX = 1 / ((1 / h) + (1 / d))
  const oneTwo = 1 / ((1 / h) + (1 / a))
  const twoX = 1 / ((1 / d) + (1 / a))

  // Generic values used by either column set
  const valueFor = (key) => {
    switch (key) {
      case '1':     return h
      case 'X':     return d
      case '2':     return a
      case '1X':    return oneX
      case '12':    return oneTwo
      case '2X':    return twoX
      case 'O':     return 1 + (h + a) / 10
      case 'TOTAL': return (h + a) * 5
      case 'U':     return 1 + (h + a) / 8
      default:      return null
    }
  }

  const colTemplate = `110px minmax(180px,1fr) 52px ${cols.map(() => '64px').join(' ')}`

  return (
    <>
      {/* MOBILE */}
      <div className="md:hidden">
        <MobileMatchCard match={match} />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-[#f0f1f4] border-b border-[#d8dae0]">
        {/* Column header */}
        <div
          className="grid gap-1 items-center px-3 py-1 text-[10px] text-gray-500 bg-[#f0f1f4]"
          style={{ gridTemplateColumns: colTemplate }}
        >
          <div />
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-gray-400" />
          </div>
          <div />
          {cols.map((c) => (
            <div key={c.key} className="text-center">
              {c.label}
            </div>
          ))}
        </div>

        {/* Match row */}
        <div
          className="grid gap-1 items-center px-3 py-2"
          style={{ gridTemplateColumns: colTemplate }}
        >
          {/* Kickoff / status */}
          <div className="text-[11px] text-gray-600 leading-tight">
            {live ? (
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-600">
                {statusText(match)}
              </span>
            ) : (
              <span>{statusText(match)}</span>
            )}
          </div>

          {/* Teams + metadata row */}
          <div className="min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Star size={12} className="text-gray-400 shrink-0" />
              <span className="text-sm text-black truncate">{match.homeTeam}</span>
              {hasScore && (
                <span className="text-sm font-bold text-black ml-auto">
                  {match.homeScore}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-gray-400 shrink-0" />
              <span className="text-sm text-gray-700 truncate">{match.awayTeam}</span>
              {hasScore && (
                <span className="text-sm font-bold text-black ml-auto">
                  {match.awayScore}
                </span>
              )}
            </div>
            {/* Metadata row */}
            <div className="flex items-center gap-2 text-[10px] text-gray-500 pl-5">
              {live && (
                <>
                  <span>Event in progress</span>
                  {match.period && <span>· {match.period}</span>}
                </>
              )}
              <BarChart2 size={10} />
              <Tv size={10} />
              <Activity size={10} />
              <Lock size={10} />
            </div>
          </div>

          {/* Spacer score column (not used, but keeps grid aligned) */}
          <div />

          {/* Odds */}
          {cols.map((c) => {
            if (c.key === 'MORE') {
              return (
                <button
                  key={c.key}
                  className="w-full h-8 rounded bg-[#e8eaef] hover:bg-[#d8dae0] text-black text-[10px] font-bold"
                >
                  {c.label}
                </button>
              )
            }
            return (
              <OddButton
                key={c.key}
                match={match}
                type={c.key}
                value={valueFor(c.key)}
                suspended={
                  match.oddsSuspended ||
                  (c.key === 'X' && match.sport !== 'FOOTBALL') ||
                  (c.key === '1X' && match.sport !== 'FOOTBALL') ||
                  (c.key === '2X' && match.sport !== 'FOOTBALL')
                }
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
