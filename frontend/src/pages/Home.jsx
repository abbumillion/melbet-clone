import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import LeagueSection from '../components/LeagueSection'

export default function Home({ selectedSport }) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { data } = await client.get('/matches')
        if (!cancelled) setMatches(data)
      } catch (err) {
        console.error('Failed to load matches', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 10_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const filtered = useMemo(() => {
    if (selectedSport === 'ALL') return matches
    return matches.filter((m) => m.sport === selectedSport)
  }, [matches, selectedSport])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const m of filtered) {
      const key = `${m.sport}|${m.league}`
      if (!map.has(key)) map.set(key, { league: m.league, matches: [] })
      map.get(key).matches.push(m)
    }
    return Array.from(map.values())
  }, [filtered])

  if (loading) {
    return (
      <div className="p-8 text-gray-400">Loading matches...</div>
    )
  }

  if (grouped.length === 0) {
    return (
      <div className="p-8 text-gray-400">
        No matches available for this sport right now.
      </div>
    )
  }

  return (
    <div className="p-4">
      {grouped.map((group) => (
        <LeagueSection
          key={group.league}
          league={group.league}
          matches={group.matches}
        />
      ))}
    </div>
  )
}
