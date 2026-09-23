import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import EthiopiaContent from './EthiopiaContent'

const NAV_COLUMNS = [
  {
    title: 'MAIN',
    links: [
      'Melbet Ethiopia',
      'Download Mobile App',
      'Login',
      'Registration',
      'Welcome Bonus',
      'Online Casino',
      'Live Casino',
      'Sports Betting',
      'Live Betting',
    ],
  },
  {
    title: 'POPULAR SPORTS',
    links: [
      'Soccer Betting',
      'Basketball Betting',
      'Tennis Betting',
      'Cricket Betting',
      'Chess Betting',
    ],
  },
  {
    title: 'POPULAR CASINO GAMES',
    links: [
      'Keno',
      'Bingo',
      'Aviator',
      'Chicken Road',
      'Chicken Road 2.0',
      '15 Coins',
      'Tower Rush',
      'Crown Coins',
      'Sweet Bonanza',
    ],
  },
  {
    title: 'LEGAL INFORMATION',
    links: [
      'About Us',
      'Contacts',
      'How to place a bet',
      'Cookies Policy',
      'Responsible Gambling',
      'Terms and Conditions',
      'Privacy Policy',
      'Terms of Service',
      'KYC Policies',
      'Privacy & Management of Personal Data',
    ],
  },
  {
    title: 'OUR PARTNERS',
    links: ['Andres Iniesta', 'Kamaru Usman', 'OG Esports'],
  },
]

const ACCORDIONS = [
  {
    title: 'SPORTS BETTING MELBET ETHIOPIA OFFICIAL',
    content: 'ethiopia-content',
  },
  {
    title: 'MELBET ETHIOPIA NAVIGATION',
    content: 'navigation-links',
  },
  {
    title: 'FAQ',
    content: (
      <p className="text-xs text-gray-400 leading-relaxed pb-4">
        Need help? Check our FAQ or contact customer support via live chat 24/7.
      </p>
    ),
  },
]

function NavigationGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-6 py-4">
      {NAV_COLUMNS.map((col) => (
        <div key={col.title}>
          <h4 className="text-[11px] font-bold text-white mb-3 tracking-wider">
            {col.title}
          </h4>
          <ul className="space-y-1.5">
            {col.links.map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className="text-xs text-gray-400 hover:text-[#ffb800] transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function Accordion({ title, content, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen)
  return (
    <div className="border-b border-[#1e2a44]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-4 text-xs font-bold text-white hover:text-[#ffb800] tracking-wider"
      >
        <span>{title}</span>
        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {open && (
        <div>
          {content === 'navigation-links' ? (
            <NavigationGrid />
          ) : content === 'ethiopia-content' ? (
            <EthiopiaContent />
          ) : (
            <div>{content}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="hidden md:block bg-[#0b1220] border-t border-[#1e2a44] mt-8">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Accordions */}
        <div className="mb-8">
          {ACCORDIONS.map((a, idx) => (
            <Accordion
              key={a.title}
              title={a.title}
              content={a.content}
              defaultOpen={idx === 0}
            />
          ))}
        </div>

        {/* Bottom links row */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-8 pt-6 border-t border-[#1e2a44]">
          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">
              INFORMATION
            </h3>
            <ul className="space-y-1.5">
              {['About us', 'Terms and Conditions', 'Affiliate Program'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-gray-400 hover:text-[#ffb800]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">BETTING</h3>
            <ul className="space-y-1.5">
              {['Sports', 'Multi-LIVE', 'Live', 'Toto'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-gray-400 hover:text-[#ffb800]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">GAMES</h3>
            <ul className="space-y-1.5">
              {['Casino', 'Fast Games', 'Live Casino'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-gray-400 hover:text-[#ffb800]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">STATISTICS</h3>
            <ul className="space-y-1.5">
              {['Statistics', 'Results'].map((l) => (
                <li key={l}>
                  <a href="#" className="text-xs text-gray-400 hover:text-[#ffb800]">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">
              USEFUL LINKS
            </h3>
            <ul className="space-y-1.5">
              {['Mobile version', 'Registration', 'Responsible Gambling', 'Our awards'].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="text-xs text-gray-400 hover:text-[#ffb800]">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white mb-3 tracking-wider">APPS</h3>
            <div className="flex gap-1 mb-3">
              <button className="flex-1 bg-[#1e2a44] hover:bg-[#2a3a5c] rounded px-2 py-1.5 text-[10px] text-white flex items-center justify-center gap-1">
                <span>🤖</span> Android
              </button>
              <button className="flex-1 bg-[#1e2a44] hover:bg-[#2a3a5c] rounded px-2 py-1.5 text-[10px] text-white flex items-center justify-center gap-1">
                <span>🍎</span> iOS
              </button>
            </div>
            <div className="bg-[#1e2a44] rounded p-3 flex items-center gap-3">
              <div className="w-14 h-14 bg-white rounded grid grid-cols-4 grid-rows-4 gap-0.5 p-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${(i * 7 + 3) % 2 === 0 ? 'bg-black' : 'bg-white'} rounded-sm`}
                  />
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold text-[#ffb800]">MELBET</div>
                <div className="text-[9px] text-white leading-tight">
                  MOBILE
                  <br />
                  APPLICATION
                </div>
                <button className="mt-1 text-[9px] bg-[#1a1a1a] text-white rounded px-2 py-0.5">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="text-[10px] text-gray-500 leading-relaxed space-y-3 pt-6 border-t border-[#1e2a44]">
          <p>
            Melbet is owned and operated by Bet Win Sport PLC, which operates under license
            issued by National Lottery Administration of the Federal Democratic Republic
            of Ethiopia on 8th of January 2020.
          </p>
          <div className="flex items-center gap-3">
            <div className="bg-[#1e2a44] rounded px-3 py-1.5 text-[10px] text-white flex items-center gap-2">
              <span>🛡️</span> DMCA PROTECTED
            </div>
          </div>
          <p>
            Melbet uses cookies to ensure the best user experience. By remaining on the
            website, you consent to the use of cookie files on Melbet.
          </p>
          <p>© 2015-2026. All rights reserved and protected by law.</p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#1e2a44]">
          <div className="flex items-center gap-3">
            <button className="bg-[#1e2a44] hover:bg-[#2a3a5c] rounded p-2 text-white">
              💬
            </button>
            <button className="bg-[#1e2a44] hover:bg-[#2a3a5c] rounded p-2 text-white">
              ✈️
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white text-sm font-bold">21+</span>
            <button className="bg-[#1e2a44] hover:bg-[#2a3a5c] rounded px-4 py-2 text-xs text-white">
              MOBILE VERSION
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
