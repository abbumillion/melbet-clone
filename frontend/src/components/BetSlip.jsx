import { useState } from 'react'
import { Maximize2, Settings, Trash2, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function BetSlip() {
  const [tab, setTab] = useState('slip')
  const { isAuthed } = useAuth()

  return (
    <aside className="w-72 shrink-0 bg-[#0f1a2e] border-l border-[#1e2a44] sticky top-14 h-[calc(100vh-3.5rem)] flex flex-col">
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
          Bet slip
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
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e2a44]">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Your bets
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-gray-400 hover:text-white">
                <Maximize2 size={13} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <Settings size={13} />
              </button>
              <button className="p-1 text-gray-400 hover:text-white">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Empty state */}
          <div className="flex-1 flex items-center justify-center px-6 text-center">
            <div className="text-xs text-gray-400 leading-relaxed">
              Add events to the bet slip or enter a code to load events
            </div>
          </div>

          {/* Favorite hint */}
          <div className="border-t border-[#1e2a44] p-3">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-300 mb-2">
              <span>🏆</span>
              <span className="font-semibold">Bet on the favorite!</span>
            </div>
            <div className="bg-[#131d33] rounded border border-[#1e2a44] p-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span>⚽</span>
                <span>21317. Africa Cup of Nations</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div>
                  <div className="text-xs text-white font-semibold">Sudan - Ethiopia</div>
                  <div className="text-[10px] text-gray-400">1x2: Sudan</div>
                </div>
                <div className="bg-[#ffb800] text-black rounded px-2 py-1 text-sm font-bold">
                  1.81
                </div>
              </div>
            </div>
            <button className="w-full mt-2 py-1.5 rounded bg-[#1e2a44] hover:bg-[#2a3a5c] text-xs font-semibold text-white">
              Add to bet slip
            </button>
          </div>

          {/* Login prompt or stake area */}
          <div className="border-t border-[#1e2a44] p-3">
            {isAuthed ? (
              <button className="w-full py-2 rounded bg-[#ffb800] hover:bg-[#ffc93a] text-black font-bold text-sm">
                Place bet
              </button>
            ) : (
              <button className="w-full py-2 rounded bg-[#ffb800] hover:bg-[#ffc93a] text-black font-bold text-sm">
                Login to bet
              </button>
            )}
          </div>
        </>
      )}

      {tab === 'bets' && (
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div className="text-xs text-gray-400">
            No bets placed yet.
          </div>
        </div>
      )}

      {/* Collapse bar */}
      <div className="border-t border-[#1e2a44] py-1.5 flex items-center justify-center text-gray-500 hover:text-white cursor-pointer">
        <ChevronUp size={14} />
      </div>
    </aside>
  )
}
