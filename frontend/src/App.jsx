import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import IconRail from './components/IconRail'
import BetSlip from './components/BetSlip'
import MatchFilters from './components/MatchFilters'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import Help from './pages/Help'
import About from './pages/About'
import Settings from './pages/Settings'

function SportsLayout() {
  const [activeIcon, setActiveIcon] = useState('home')
  const [tab, setTab] = useState('Matches')
  const [sport, setSport] = useState('ALL')
  const [liveOnly, setLiveOnly] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <div className="flex">
      <IconRail active={activeIcon} onChange={setActiveIcon} />
      <div className="flex-1 min-w-0">
        <MatchFilters
          tab={tab} setTab={setTab}
          sport={sport} setSport={setSport}
          liveOnly={liveOnly} setLiveOnly={setLiveOnly}
          query={query} setQuery={setQuery}
        />
        <Home selectedSport={sport} liveOnly={liveOnly} query={query} />
      </div>
      <BetSlip />
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0b1220]">
      <Header />
      <Routes>
        <Route path="/"      element={<SportsLayout />} />
        <Route path="/live"  element={<SportsLayout />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/signup"   element={<Signup />} />
        <Route path="/verify"   element={<Verify />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help"     element={<Help />} />
        <Route path="/about"    element={<About />} />
      </Routes>
    </div>
  )
}
