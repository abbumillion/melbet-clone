import { useEffect, useMemo, useState } from 'react'
import client from '../api/client'
import LeagueSection from '../components/LeagueSection'

export default function Home({ selectedSport, liveOnly, query }) {
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
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const filtered = useMemo(() => {
    let list = matches
    if (selectedSport !== 'ALL') list = list.filter((m) => m.sport === selectedSport)
    if (liveOnly) list = list.filter((m) => m.status === 'LIVE' || m.status === 'HT')
    if (query?.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (m) =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q)
      )
    }
    return list
  }, [matches, selectedSport, liveOnly, query])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const m of filtered) {
      const key = `${m.sport}|${m.league}`
      if (!map.has(key)) map.set(key, { league: m.league, matches: [] })
      map.get(key).matches.push(m)
    }
    return Array.from(map.values())
  }, [filtered])

  if (loading) return <div className="p-8 text-gray-400 text-sm">Loading matches...</div>
  if (grouped.length === 0)
    return <div className="p-8 text-gray-400 text-sm">No matches for this filter.</div>

  return (
    <div>
      {grouped.map((g) => (
        <LeagueSection key={g.league} league={g.league} matches={g.matches} />
      ))}
    </div>
  )
}
