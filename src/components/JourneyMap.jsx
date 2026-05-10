import { motion } from 'framer-motion'

const LOCATIONS = [
  { id: 'vijayawada', name: 'Vijayawada', emoji: '🏠', x: 130, y: 110, color: '#f59e0b' },
  { id: 'kochi', name: 'Kochi', emoji: '🌆', x: 140, y: 360, color: '#f59e0b' },
  { id: 'munnar', name: 'Munnar', emoji: '⛰️', x: 480, y: 170, color: '#f59e0b' },
  { id: 'alleppey', name: 'Alleppey', emoji: '🛶', x: 520, y: 330, color: '#f59e0b' },
]

const PATHS = {
  train: 'M 130,110 Q 110,220 140,360',
  road: 'M 140,360 Q 300,260 480,170 Q 530,240 520,330',
  trainReturn: 'M 140,360 Q 110,220 130,110',
}

const LAND_SHAPE = 'M120 70 C210 40 380 40 520 90 C640 130 680 220 650 320 C620 430 470 470 300 450 C160 430 90 340 90 230 C90 150 100 90 120 70 Z'
const WATER_SHAPE = 'M460 260 C520 230 610 240 640 290 C670 340 650 400 580 410 C520 420 470 380 450 330 C440 300 445 275 460 260 Z'

function JourneyMap() {
  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ Kerala Journey Map</div>
        <p className="journey-iso-copy">Flat 2D animated route from Vijayawada to Kerala highlights. May 22-26, 2026.</p>
      </div>

      <div className="relative w-full h-[520px] md:h-[600px] overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.15),transparent_45%)]" />
          <div className="absolute inset-0 flex items-center justify-center text-5xl md:text-7xl font-semibold text-white/5 tracking-[0.45em]">JOURNEY</div>
        </div>

        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 700 500"
          role="img"
          aria-label="2D journey map with train, road and backwater routes"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <defs>
            <linearGradient id="landGradient2d" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="waterGradient2d" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="routeGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          <path d={LAND_SHAPE} fill="url(#landGradient2d)" opacity="0.95" />
          <path d={WATER_SHAPE} fill="url(#waterGradient2d)" opacity="0.9" />

          <g opacity="0.6" stroke="rgba(191,219,254,0.6)" fill="none">
            <circle cx="560" cy="320" r="16">
              <animate attributeName="r" values="12;18;12" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="590" cy="350" r="10">
              <animate attributeName="r" values="8;14;8" dur="3.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.5s" repeatCount="indefinite" />
            </circle>
          </g>

          <motion.path
            d={PATHS.train}
            stroke="url(#routeGlow)"
            strokeWidth="4"
            strokeDasharray="12 8"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 1.8 }}
          />
          <motion.path
            d={PATHS.road}
            stroke="#64748b"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 2, delay: 0.2 }}
          />
          <motion.path
            d={PATHS.trainReturn}
            stroke="#f59e0b"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.7 }}
            transition={{ duration: 1.8, delay: 0.6 }}
          />

          <text x="250" y="210" fill="white" fontSize="12" opacity="0.55">150 km</text>
          <text x="470" y="260" fill="white" fontSize="12" opacity="0.55">160 km</text>

          {LOCATIONS.map((location) => (
            <g key={location.id}>
              <circle cx={location.x} cy={location.y} r="10" fill={location.color} opacity="0.85" />
              <circle cx={location.x} cy={location.y} r="16" stroke={location.color} strokeWidth="2" fill="none" opacity="0.4">
                <animate attributeName="r" values="12;18;12" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" />
              </circle>
              <text x={location.x + 14} y={location.y + 4} fill="white" fontSize="12" fontWeight="600">{location.name}</text>
            </g>
          ))}

          <g>
            <text fontSize="20">🚆
              <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                <mpath href="#trainPath2d" />
              </animateMotion>
            </text>
            <path id="trainPath2d" d={PATHS.train} fill="none" />
          </g>
          <g>
            <text fontSize="18">🚗
              <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
                <mpath href="#roadPath2d" />
              </animateMotion>
            </text>
            <path id="roadPath2d" d={PATHS.road} fill="none" />
          </g>
          <g>
            <text x="540" y="330" fontSize="18">🛶
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="3s" repeatCount="indefinite" />
            </text>
          </g>
        </motion.svg>
      </div>
    </div>
  )
}

export default JourneyMap
