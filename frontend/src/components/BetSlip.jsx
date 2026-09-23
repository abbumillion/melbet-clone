import { useState } from 'react'
import {
  Maximize2,
  Settings,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react'
import { useBetSlip } from '../context/BetSlipContext'
import { useAuth } from '../context/AuthContext'

export default function BetSlip({ collapsed, onToggle }) {
  const [tab, setTab] = useState('slip')
  const [stake, setStake] = useState('')
  const { selections, removeSelection, clearAll } = useBetSlip()
  const { isAuthed } = useAuth()

  const totalOdds = selections.reduce((acc, s) => acc * s.odds, 1)
  const stakeNum = parseFloat(stake) || 0
  const payout = stakeNum * totalOdds

  // ---- Collapsed state ----
  if (collapsed) {
    return (
      <div className="w-10 shrink-0 bg-[#0f1a2e] border-l border-[#1e2a44] sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col items-center pt-3">
        <button
          onClick={onToggle}
          title="Expand bet slip"
          className="p-1.5 rounded text-gray-400 hover:text-[#ffb800] hover:bg-[#1e2a44]"
        >
          <ChevronLeft size={16} />
        </button>
        {selections.length > 0 && (
          <div className="mt-2 w-6 h-6 rounded-full bg-[#ffb800] text-black text-[10px] font-bold flex items-center justify-center">
            {selections.length}
          </div>
        )}
      </div>
    )
  }

  // ---- Expanded state ----
  return (
    <aside className="w-72 shrink-0 bg-[#0f1a2e] border-l border-[#1e2a44] sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Collapse header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-end gap-1 px-3 py-1.5 text-[10px] text-gray-500 hover:text-white border-b border-[#1e2a44]"
      >
        Collapse block
        <ChevronRight size={12} />
      </button>

      {/* Tabs */}
      <div className="flex border-b border-[#1e2a44]">
        <button
          onClick={() => setTab('slip')}
          className={`flex-1 py-2.5 text-xs font-bold ${
            tab === 'slip'
              ? 'bg-[#1e2a44] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bet slip {selections.length > 0 && `(${selections.length})`}
        </button>
        <button
          onClick={() => setTab('bets')}
          className={`flex-1 py-2.5 text-xs font-bold ${
            tab === 'bets'
              ? 'bg-[#1e2a44] text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My bets
        </button>
      </div>

      {tab === 'slip' && (
        <>
          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2a44]">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Your bets ({selections.length})
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-gray-400 hover:text-white">
                <Maximize2 size={13} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <Settings size={13} />
              </button>
              <button
                onClick={clearAll}
                disabled={selections.length === 0}
                className="p-1 text-gray-400 hover:text-red-400 disabled:opacity-40"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Empty / selections */}
          {selections.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-6 text-center">
              <div className="text-xs text-gray-400 leading-relaxed">
                Add events to the bet slip or enter a code to load events
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {selections.map((s) => (
                <div
                  key={`${s.matchId}-${s.type}`}
                  className="border-b border-[#1e2a44] px-3 py-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-gray-500 truncate">
                        {s.league}
                      </div>
                      <div className="text-xs text-white truncate">
                        {s.homeTeam} - {s.awayTeam}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        Selection:{' '}
                        <span className="text-white font-semibold">{s.type}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        onClick={() => removeSelection(s.matchId)}
                        className="text-gray-500 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                      <div className="text-sm font-bold text-[#ffb800]">
                        {s.odds.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stake + payout */}
          {selections.length > 0 && (
            <div className="border-t border-[#1e2a44] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="10"
                  placeholder="Stake"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="flex-1 bg-[#0b1220] border border-[#1e2a44] rounded px-3 py-2 text-sm text-white outline-none focus:border-[#ffb800]"
                />
                <span className="text-xs text-gray-400">ETB</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total odds</span>
                <span className="text-white font-semibold">
                  {totalOdds.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Potential payout</span>
                <span className="text-[#ffb800] font-bold">
                  {payout.toFixed(2)} ETB
                </span>
              </div>

              <button
                disabled={!isAuthed || stakeNum <= 0}
                className="w-full py-2 rounded bg-[#ffb800] hover:bg-[#ffc93a] text-black font-bold text-sm disabled:opacity-50"
              >
                {isAuthed ? 'Place bet' : 'Login to bet'}
              </button>
            </div>
          )}

          {/* Favorite hint */}
          <div className="border-t border-[#1e2a44] p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300 mb-2">
              <span>🏆</span>
              <span className="font-semibold">Bet on the favorite!</span>
            </div>
            <div className="bg-[#131d33] rounded border border-[#1e2a44] p-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span>⚽</span>
                <span>Africa Cup of Nations</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="text-xs text-white font-semibold">
                    Sudan - Ethiopia
                  </div>
                  <div className="text-[10px] text-gray-400">1x2: Sudan</div>
                </div>
                <div className="bg-[#ffb800] text-black rounded px-2 py-1 text-sm font-bold">
                  1.81
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'bets' && (
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div className="text-xs text-gray-400">No bets placed yet.</div>
        </div>
      )}

      {/* Collapse bar bottom */}
      <button
        onClick={onToggle}
        className="border-t border-[#1e2a44] py-1.5 flex items-center justify-center text-gray-500 hover:text-white"
      >
        <ChevronUp size={14} />
      </button>
    </aside>
  )
}
