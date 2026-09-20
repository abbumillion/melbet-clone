import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import Help from './pages/Help'
import About from './pages/About'
import Settings from './pages/Settings'

function SportsLayout({ selectedSport, setSelectedSport }) {
  return (
    <div className="flex">
      <Sidebar selected={selectedSport} onChange={setSelectedSport} />
      <main className="flex-1 min-w-0">
        <Home selectedSport={selectedSport} />
      </main>
    </div>
  )
}

export default function App() {
  const [selectedSport, setSelectedSport] = useState('ALL')

  return (
    <div className="min-h-screen bg-[#0b1220]">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <SportsLayout
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
            />
          }
        />
        <Route
          path="/live"
          element={
            <SportsLayout
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  )
}
