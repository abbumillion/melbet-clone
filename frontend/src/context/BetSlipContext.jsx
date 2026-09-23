import { createContext, useContext, useEffect, useState } from 'react'

const BetSlipContext = createContext(null)
const STORAGE_KEY = 'betslip'

export function BetSlipProvider({ children }) {
  const [selections, setSelections] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
  }, [selections])

  const addSelection = (selection) => {
    setSelections((prev) => {
      // One pick per match — replace any prior pick for the same match
      const filtered = prev.filter((s) => s.matchId !== selection.matchId)
      return [...filtered, selection]
    })
  }

  const removeSelection = (matchId) => {
    setSelections((prev) => prev.filter((s) => s.matchId !== matchId))
  }

  const clearAll = () => setSelections([])

  const isSelected = (matchId, type) =>
    selections.some((s) => s.matchId === matchId && s.type === type)

  return (
    <BetSlipContext.Provider
      value={{ selections, addSelection, removeSelection, clearAll, isSelected }}
    >
      {children}
    </BetSlipContext.Provider>
  )
}

export function useBetSlip() {
  return useContext(BetSlipContext)
}
