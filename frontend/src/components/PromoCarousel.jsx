const PROMOS = [
  {
    title: 'Welcome Package',
    subtitle: 'Up to 37,000 ETB',
    gradient: 'from-[#ffb800] via-[#ff8c00] to-[#d97706]',
  },
  {
    title: 'Africa Cup',
    subtitle: 'Bet on your nation',
    gradient: 'from-[#0ea5e9] via-[#0284c7] to-[#075985]',
  },
  {
    title: 'Live Casino',
    subtitle: 'Play now',
    gradient: 'from-[#a855f7] via-[#7c3aed] to-[#5b21b6]',
  },
  {
    title: 'eSports Major',
    subtitle: 'CS:GO · LoL · Dota',
    gradient: 'from-[#ef4444] via-[#dc2626] to-[#991b1b]',
  },
  {
    title: '200% Bonus',
    subtitle: 'First deposit',
    gradient: 'from-[#10b981] via-[#059669] to-[#065f46]',
  },
]

export default function PromoCarousel() {
  return (
    <div className="md:hidden py-3 px-3">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3 scrollbar-hide">
        {PROMOS.map((p) => (
          <button
            key={p.title}
            className={`shrink-0 w-40 h-20 rounded-lg bg-gradient-to-br ${p.gradient} p-3 text-left text-white shadow-lg relative overflow-hidden`}
          >
            <div className="relative z-10">
              <div className="text-xs font-bold leading-tight">{p.title}</div>
              <div className="text-[10px] opacity-90 mt-0.5">{p.subtitle}</div>
            </div>
            <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/15" />
          </button>
        ))}
      </div>
    </div>
  )
}
