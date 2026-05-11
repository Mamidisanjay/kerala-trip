import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOCATIONS = [
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    subtitle: 'Home Sweet Home',
    emoji: '🏠',
    icon: '🏛️',
    x: 15,
    y: 25,
    color: '#8b5cf6',
    glow: '#c084fc',
    date: 'May 22, 2026',
    time: '03:50 AM',
    activities: ['Departure', 'Board Kochi Express', '22h Train Journey'],
  },
  {
    id: 'kochi',
    name: 'Kochi',
    subtitle: 'Queen of Arabian Sea',
    emoji: '🌊',
    icon: '⛴️',
    x: 28,
    y: 72,
    color: '#06b6d4',
    glow: '#22d3ee',
    date: 'May 23, 2026',
    time: '02:00 AM',
    activities: ['Arrival', 'Fort Kochi', 'Chinese Nets', 'Marine Drive'],
  },
  {
    id: 'munnar',
    name: 'Munnar',
    subtitle: 'Kashmir of South',
    emoji: '⛰️',
    icon: '🍃',
    x: 58,
    y: 38,
    color: '#10b981',
    glow: '#34d399',
    date: 'May 23-24',
    time: 'Full Day',
    activities: ['Tea Museum', 'Echo Point', 'Mattupetty Dam', 'National Park'],
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    subtitle: 'Venice of the East',
    emoji: '🛶',
    icon: '🌴',
    x: 70,
    y: 65,
    color: '#3b82f6',
    glow: '#60a5fa',
    date: 'May 25, 2026',
    time: 'Houseboat',
    activities: ['Backwater Cruise', 'Village Tour', 'Sunset Views', 'Kerala Cuisine'],
  },
]

const PATHS = [
  {
    id: 'train',
    d: 'M 15 25 Q 18 45 28 72',
    color: 'url(#trainGradient)',
    width: 4,
    dashArray: '12 6',
    label: '1,350 km',
    labelX: 18,
    labelY: 50,
    mode: '🚆',
    duration: 2.5,
  },
  {
    id: 'road1',
    d: 'M 28 72 Q 40 50 58 38',
    color: '#64748b',
    width: 3,
    dashArray: 'none',
    label: '150 km',
    labelX: 42,
    labelY: 55,
    mode: '🚗',
    duration: 2,
  },
  {
    id: 'road2',
    d: 'M 58 38 Q 65 50 70 65',
    color: '#64748b',
    width: 3,
    dashArray: 'none',
    label: '160 km',
    labelX: 65,
    labelY: 50,
    mode: '🚗',
    duration: 2,
  },
  {
    id: 'road3',
    d: 'M 70 65 Q 50 70 28 72',
    color: '#64748b',
    width: 2.5,
    dashArray: '6 4',
    label: '75 km',
    labelX: 50,
    labelY: 72,
    mode: '🚗',
    duration: 1.5,
  },
  {
    id: 'trainReturn',
    d: 'M 28 72 Q 18 45 15 25',
    color: '#a78bfa',
    width: 3,
    dashArray: '10 5',
    label: '',
    mode: '🚆',
    duration: 2,
  },
]

const STAR_FIELD = (() => {
  let seed = 1337
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  return Array.from({ length: 80 }).map(() => ({
    left: next() * 100,
    top: next() * 100,
    duration: 2 + next() * 3,
    delay: next() * 5,
  }))
})()

function JourneyMap() {
  const [activeLocation, setActiveLocation] = useState(null)

  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ Kerala Journey Map</div>
        <p className="journey-iso-copy">Tata Express to Kochi, then road trip through Munnar and Alleppey. May 22-26, 2026.</p>
      </div>

      <motion.div
        className="relative w-full h-[700px] md:h-[800px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {STAR_FIELD.map((star, index) => (
            <motion.div
              key={index}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
              }}
            />
          ))}
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-600/15 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl h-full">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <rect x="0" y="0" width="100" height="100" fill="url(#oceanGradient)" />

              <motion.ellipse
                cx="50"
                cy="55"
                rx="38"
                ry="30"
                fill="url(#landGradient)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.95 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />

              <motion.ellipse
                cx="58"
                cy="38"
                rx="14"
                ry="10"
                fill="url(#mountainGradient)"
                opacity="0.85"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >
                <animate attributeName="ry" values="10;11;10" dur="5s" repeatCount="indefinite" />
              </motion.ellipse>

              <g opacity="0.4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <rect
                    key={`tea-${i}`}
                    x={53 + (i % 3) * 2.5}
                    y={35 + Math.floor(i / 3) * 2}
                    width="2"
                    height="1.5"
                    fill="#22c55e"
                    rx="0.3"
                  />
                ))}
              </g>

              <g opacity="0.75">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.ellipse
                    key={`water-${i}`}
                    cx={66 + i * 3}
                    cy={63 + (i % 2) * 2.5}
                    rx={3 + i * 0.5}
                    ry={2}
                    fill="url(#waterGradient)"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </g>

              <path
                d="M 20 60 Q 25 72 30 75 Q 35 77 40 76 Q 50 74 60 72 Q 70 70 80 68"
                stroke="#3b82f6"
                strokeWidth="0.5"
                fill="none"
                opacity="0.3"
              />

              {PATHS.map((path, idx) => (
                <motion.path
                  key={path.id}
                  d={path.d}
                  stroke={path.color}
                  strokeWidth={path.width}
                  strokeDasharray={path.dashArray}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter={path.id === 'train' ? 'url(#glow)' : 'none'}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: path.id === 'trainReturn' ? 0.5 : 0.9 }}
                  transition={{
                    duration: path.duration,
                    delay: 0.8 + idx * 0.4,
                    ease: 'easeInOut',
                  }}
                />
              ))}

              {PATHS.filter((p) => p.label).map((path, idx) => (
                <motion.text
                  key={`label-${idx}`}
                  x={path.labelX}
                  y={path.labelY}
                  fill="white"
                  fontSize="2"
                  fontWeight="bold"
                  opacity="0.6"
                  textAnchor="middle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 2 + idx * 0.3 }}
                >
                  {path.label}
                </motion.text>
              ))}

              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#065f46" />
                  <stop offset="30%" stopColor="#059669" />
                  <stop offset="70%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>

                <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>

                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>

                <linearGradient id="trainGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>

                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>

            <motion.div
              className="absolute text-4xl md:text-5xl filter drop-shadow-2xl pointer-events-none"
              animate={{ offsetDistance: ['0%', '100%'] }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                offsetPath: `path("M 15% 25% Q 18% 45% 28% 72%")`,
                offsetRotate: '0deg',
                left: 0,
                top: 0,
              }}
            >
              🚆
            </motion.div>

            <motion.div
              className="absolute text-3xl md:text-4xl filter drop-shadow-xl pointer-events-none"
              animate={{
                left: ['28%', '40%', '58%', '65%', '70%', '50%', '28%'],
                top: ['72%', '60%', '38%', '50%', '65%', '72%', '72%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
              }}
            >
              🚗
            </motion.div>

            <motion.div
              className="absolute text-3xl md:text-4xl filter drop-shadow-xl pointer-events-none"
              style={{ left: '70%', top: '65%' }}
              animate={{
                y: [0, -8, 0],
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              🛶
            </motion.div>

            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`palm-${i}`}
                className="absolute text-2xl md:text-3xl opacity-25 pointer-events-none"
                style={{
                  left: `${65 + (i % 3) * 3}%`,
                  top: `${60 + Math.floor(i / 3) * 3}%`,
                }}
                animate={{
                  rotate: [-4, 4, -4],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                🌴
              </motion.div>
            ))}

            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                className="absolute text-4xl md:text-5xl opacity-10 pointer-events-none"
                style={{
                  left: `${50 + i * 8}%`,
                  top: `${30 + (i % 2) * 5}%`,
                }}
                animate={{
                  x: [-10, 10, -10],
                  opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ☁️
              </motion.div>
            ))}

            {LOCATIONS.map((location, idx) => (
              <motion.div
                key={location.id}
                className="absolute group cursor-pointer z-20"
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 2 + idx * 0.3,
                  type: 'spring',
                  stiffness: 200,
                }}
                onMouseEnter={() => setActiveLocation(location.id)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                {[1, 2].map((ring) => (
                  <motion.div
                    key={ring}
                    className="absolute -inset-4 md:-inset-6 rounded-full border-2"
                    style={{
                      borderColor: location.glow,
                      boxShadow: `0 0 20px ${location.glow}`,
                    }}
                    animate={{
                      scale: [1, 1.4 + ring * 0.2, 1],
                      opacity: [0.6, 0, 0.6],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: ring * 0.5 + idx * 0.2,
                    }}
                  />
                ))}

                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.3, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20"
                    style={{
                      background: `linear-gradient(135deg, ${location.color}, ${location.glow})`,
                      boxShadow: `0 0 30px ${location.glow}, 0 10px 25px rgba(0,0,0,0.4)`,
                    }}
                  >
                    <span className="text-2xl md:text-3xl">{location.emoji}</span>
                  </div>

                  <div
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                    style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
                  >
                    <div className="text-white text-sm md:text-base font-bold mb-0.5">{location.name}</div>
                    <div className="text-slate-300 text-xs font-medium opacity-80">{location.subtitle}</div>
                  </div>

                  <AnimatePresence>
                    {activeLocation === location.id && (
                      <motion.div
                        className="absolute -top-48 left-1/2 -translate-x-1/2 w-64 z-50"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <div className="bg-gradient-to-br from-slate-900/98 to-slate-800/98 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">{location.icon}</span>
                            <div>
                              <div className="text-white font-bold text-lg">{location.name}</div>
                              <div className="text-slate-300 text-sm">{location.subtitle}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-3 pb-3 border-b border-white/10">
                            <span>📅</span>
                            <span>{location.date}</span>
                            <span className="mx-1">•</span>
                            <span>🕐</span>
                            <span>{location.time}</span>
                          </div>

                          <div className="space-y-1.5">
                            {location.activities.map((activity, i) => (
                              <motion.div
                                key={i}
                                className="flex items-center gap-2 text-sm text-slate-300"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: location.glow }}
                                />
                                {activity}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-r border-b border-white/20"
                          style={{
                            background: 'linear-gradient(135deg, rgb(15 23 42 / 0.98), rgb(30 41 59 / 0.98))',
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        {[
          { icon: '🚆', label: 'Train', value: '1,350 km', color: 'from-purple-400 to-purple-600' },
          { icon: '🚗', label: 'Road', value: '385 km', color: 'from-cyan-400 to-cyan-600' },
          { icon: '📍', label: 'Stops', value: '4 Cities', color: 'from-green-400 to-green-600' },
          { icon: '📅', label: 'Days', value: '5 Days', color: 'from-pink-400 to-pink-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 text-center"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
            <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <div className="w-8 h-1 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" />
          <span className="text-slate-300 text-sm">Train</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <div className="w-8 h-1 rounded-full bg-slate-500" />
          <span className="text-slate-300 text-sm">Road</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-purple-700" />
          <span className="text-slate-300 text-sm">Destinations</span>
        </div>
      </motion.div>
    </div>
  )
}

export default JourneyMap
