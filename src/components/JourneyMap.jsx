import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOCATIONS = [
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    subtitle: 'Home Sweet Home',
    emoji: '🏠',
    icon: '🏛️',
    x: 180,
    y: 120,
    z: 30,
    color: '#8b5cf6',
    glow: '#c084fc',
    date: 'May 22, 2026',
    time: '03:50 AM',
    activities: ['Departure', 'Board Kochi Express'],
    mood: 'excitement',
  },
  {
    id: 'kochi',
    name: 'Kochi',
    subtitle: 'Queen of Arabian Sea',
    emoji: '🌊',
    icon: '⛴️',
    x: 140,
    y: 380,
    z: 15,
    color: '#06b6d4',
    glow: '#22d3ee',
    date: 'May 23, 2026',
    time: '02:00 AM',
    activities: ['Arrival', 'Fort Kochi', 'Chinese Nets', 'Marine Drive'],
    mood: 'wonder',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    subtitle: 'Kashmir of South India',
    emoji: '⛰️',
    icon: '🍃',
    x: 520,
    y: 180,
    z: 60,
    color: '#10b981',
    glow: '#34d399',
    date: 'May 23-24',
    time: 'Full Day',
    activities: ['Tea Museum', 'Echo Point', 'Mattupetty Dam', 'National Park'],
    mood: 'tranquil',
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    subtitle: 'Venice of the East',
    emoji: '🛶',
    icon: '🌴',
    x: 500,
    y: 410,
    z: 5,
    color: '#3b82f6',
    glow: '#60a5fa',
    date: 'May 25, 2026',
    time: 'Houseboat Stay',
    activities: ['Backwater Cruise', 'Village Tour', 'Sunset Views', 'Kerala Cuisine'],
    mood: 'bliss',
  },
]

const PATHS = {
  train: {
    d: 'M 180,120 Q 120,220 140,380',
    length: 1350,
    duration: '22h 10m',
    mode: '🚆',
    color: '#a855f7',
    dashArray: '15 8',
  },
  road1: {
    d: 'M 140,380 Q 280,240 520,180',
    length: 150,
    duration: '4h',
    mode: '🚗',
    color: '#64748b',
    dashArray: 'none',
  },
  road2: {
    d: 'M 520,180 Q 540,280 500,410',
    length: 160,
    duration: '4h',
    mode: '🚗',
    color: '#64748b',
    dashArray: 'none',
  },
  road3: {
    d: 'M 500,410 Q 340,420 140,380',
    length: 75,
    duration: '2h',
    mode: '🚗',
    color: '#64748b',
    dashArray: '8 4',
  },
  trainReturn: {
    d: 'M 140,380 Q 120,220 180,120',
    length: 1350,
    duration: '22h',
    mode: '🚆',
    color: '#7c3aed',
    dashArray: '12 6',
  },
}

const CAR_PATH = 'M 140,380 Q 280,240 520,180 Q 540,280 500,410'

const STAR_FIELD = (() => {
  let seed = 1337
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  return Array.from({ length: 100 }).map(() => ({
    left: next() * 100,
    top: next() * 100,
    duration: 2 + next() * 3,
    delay: next() * 5,
  }))
})()

function JourneyMap() {
  const [activeLocation, setActiveLocation] = useState(null)
  const [journeyPhase, setJourneyPhase] = useState('train')
  const [pulseStop, setPulseStop] = useState(null)

  useEffect(() => {
    let timers = []

    if (journeyPhase === 'train') {
      timers.push(setTimeout(() => setPulseStop(null), 0))
      timers.push(setTimeout(() => setPulseStop('kochi'), 3600))
      timers.push(setTimeout(() => setJourneyPhase('car'), 4000))
    }

    if (journeyPhase === 'car') {
      timers.push(setTimeout(() => setPulseStop(null), 0))
      timers.push(setTimeout(() => setPulseStop('munnar'), 2200))
      timers.push(setTimeout(() => setPulseStop('alleppey'), 4200))
      timers.push(setTimeout(() => setJourneyPhase('return'), 5000))
    }

    if (journeyPhase === 'return') {
      timers.push(setTimeout(() => setPulseStop(null), 0))
      timers.push(setTimeout(() => setPulseStop('vijayawada'), 3600))
      timers.push(setTimeout(() => setJourneyPhase('train'), 4600))
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [journeyPhase])

  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ Kerala Journey</div>
        <p className="journey-iso-copy">Tata Express to Kochi, then road trip through Munnar and Alleppey.</p>
      </div>

      <motion.div
        className="relative w-full h-[640px] md:h-[720px] overflow-hidden rounded-3xl"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950" />
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

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-3xl"
            style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
          >
            <div
              className="relative w-full h-full max-w-5xl"
              style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateZ(-42deg) scale(1.15)' }}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 700 550"
                style={{ transform: 'translateZ(0px)' }}
              >
                <rect
                  x="0"
                  y="0"
                  width="700"
                  height="550"
                  fill="url(#oceanGradient)"
                  opacity="0.95"
                />

                <motion.ellipse
                  cx="350"
                  cy="300"
                  rx="300"
                  ry="200"
                  fill="url(#landGradient)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />

                <motion.ellipse
                  cx="520"
                  cy="180"
                  rx="140"
                  ry="90"
                  fill="url(#mountainGradient)"
                  opacity="0.9"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  <animate attributeName="ry" values="90;95;90" dur="5s" repeatCount="indefinite" />
                </motion.ellipse>

                {Array.from({ length: 12 }).map((_, index) => (
                  <rect
                    key={`tea-${index}`}
                    x={480 + (index % 4) * 20}
                    y={160 + Math.floor(index / 4) * 15}
                    width="15"
                    height="10"
                    fill="#22c55e"
                    opacity="0.4"
                    rx="2"
                  />
                ))}

                <g opacity="0.8">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <motion.ellipse
                      key={`water-${index}`}
                      cx={460 + index * 25}
                      cy={390 + (index % 2) * 20}
                      rx={30 + index * 5}
                      ry={20}
                      fill="url(#waterGradient)"
                      animate={{ opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 3 + index * 0.5, repeat: Infinity, delay: index * 0.3 }}
                    />
                  ))}
                </g>

                {journeyPhase === 'train' ? (
                  <motion.path
                    d={PATHS.train.d}
                    stroke="url(#trainGradient)"
                    strokeWidth="4"
                    strokeDasharray={PATHS.train.dashArray}
                    fill="none"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                ) : (
                  <path
                    d={PATHS.train.d}
                    stroke="url(#trainGradient)"
                    strokeWidth="4"
                    strokeDasharray={PATHS.train.dashArray}
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.35"
                  />
                )}

                {journeyPhase === 'car' ? (
                  [PATHS.road1, PATHS.road2, PATHS.road3].map((path, index) => (
                    <motion.path
                      key={`road-anim-${index}`}
                      d={path.d}
                      stroke="#94a3b8"
                      strokeWidth="3"
                      strokeDasharray={path.dashArray}
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.2 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 5, ease: 'linear' }}
                    />
                  ))
                ) : (
                  [PATHS.road1, PATHS.road2, PATHS.road3].map((path, index) => (
                    <path
                      key={`road-static-${index}`}
                      d={path.d}
                      stroke="#94a3b8"
                      strokeWidth="3"
                      strokeDasharray={path.dashArray}
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.3"
                    />
                  ))
                )}

                {journeyPhase === 'return' ? (
                  <motion.path
                    d={PATHS.trainReturn.d}
                    stroke="#a78bfa"
                    strokeWidth="3"
                    strokeDasharray={PATHS.trainReturn.dashArray}
                    fill="none"
                    strokeLinecap="round"
                    opacity="0.7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                ) : null}

                <motion.text
                  x="300"
                  y="260"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  opacity="0.7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 2 }}
                >
                  150 km
                </motion.text>
                <motion.text
                  x="510"
                  y="300"
                  fill="white"
                  fontSize="11"
                  fontWeight="bold"
                  opacity="0.7"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 2.5 }}
                >
                  160 km
                </motion.text>

                <text x="210" y="235" fill="white" fontSize="12" fontWeight="700" opacity="0.7">
                  Tata Express
                </text>

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
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              {[
                { x: 160, y: 105, w: 22, h: 35, z: 18 },
                { x: 185, y: 115, w: 20, h: 28, z: 14 },
                { x: 200, y: 125, w: 18, h: 25, z: 12 },
              ].map((building, index) => (
                <motion.div
                  key={`vja-${index}`}
                  className="absolute bg-gradient-to-br from-slate-600 to-slate-700 rounded-sm"
                  style={{
                    left: `${building.x}px`,
                    top: `${building.y}px`,
                    width: `${building.w}px`,
                    height: `${building.h}px`,
                    transform: `translateZ(${building.z}px)`,
                    boxShadow: '6px 6px 15px rgba(0,0,0,0.6)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                />
              ))}

              {[
                { x: 120, y: 365, w: 20, h: 32, z: 16 },
                { x: 143, y: 375, w: 18, h: 26, z: 13 },
                { x: 163, y: 383, w: 16, h: 22, z: 11 },
              ].map((building, index) => (
                <motion.div
                  key={`kochi-${index}`}
                  className="absolute bg-gradient-to-br from-slate-500 to-slate-600 rounded-sm"
                  style={{
                    left: `${building.x}px`,
                    top: `${building.y}px`,
                    width: `${building.w}px`,
                    height: `${building.h}px`,
                    transform: `translateZ(${building.z}px)`,
                    boxShadow: '6px 6px 15px rgba(0,0,0,0.6)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.5 }}
                />
              ))}

              {journeyPhase === 'train' && (
                <motion.div
                  key="train-phase"
                  className="absolute text-4xl filter drop-shadow-2xl"
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 4, ease: 'linear' }}
                  style={{
                    offsetPath: `path("${PATHS.train.d}")`,
                    offsetRotate: 'auto',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  🚆
                </motion.div>
              )}

              {journeyPhase === 'car' && (
                <motion.div
                  key="car-phase"
                  className="absolute text-3xl filter drop-shadow-xl"
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 5, ease: 'linear' }}
                  style={{
                    offsetPath: `path("${CAR_PATH}")`,
                    offsetRotate: 'auto',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  🚗
                </motion.div>
              )}

              {journeyPhase === 'return' && (
                <motion.div
                  key="return-phase"
                  className="absolute text-4xl filter drop-shadow-2xl"
                  animate={{ offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 4, ease: 'linear' }}
                  style={{
                    offsetPath: `path("${PATHS.trainReturn.d}")`,
                    offsetRotate: 'auto',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  🚆
                </motion.div>
              )}

              <motion.div
                className="absolute text-3xl filter drop-shadow-xl"
                style={{ left: '500px', top: '410px' }}
                animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                🛶
              </motion.div>

              {LOCATIONS.map((location, index) => (
                <motion.div
                  key={location.id}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${location.x}px`,
                    top: `${location.y}px`,
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${location.z}px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 2 + index * 0.3, type: 'spring', stiffness: 200 }}
                  onHoverStart={() => setActiveLocation(location.id)}
                  onHoverEnd={() => setActiveLocation(null)}
                >
                  {[1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      className="absolute -inset-4 rounded-full border-2"
                      style={{ borderColor: location.glow, boxShadow: `0 0 20px ${location.glow}` }}
                      animate={pulseStop === location.id ? { scale: [1, 1.5 + ring * 0.3, 1], opacity: [0.6, 0, 0.6] } : { opacity: 0 }}
                      transition={{ duration: 2.2, repeat: pulseStop === location.id ? Infinity : 0, delay: ring * 0.3 }}
                    />
                  ))}

                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.3, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-2 border-white/20"
                      style={{
                        background: `linear-gradient(135deg, ${location.color}, ${location.glow})`,
                        boxShadow: `0 0 30px ${location.glow}, 0 10px 25px rgba(0,0,0,0.4)`
                      }}
                    >
                      <span className="text-3xl">{location.emoji}</span>
                    </div>

                    <div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                      style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
                    >
                      <div className="text-white text-base font-bold mb-0.5">{location.name}</div>
                      <div className="text-slate-300 text-xs font-medium opacity-80">{location.subtitle}</div>
                    </div>

                    <AnimatePresence>
                      {activeLocation === location.id && (
                        <motion.div
                          className="absolute -top-40 left-1/2 -translate-x-1/2 w-64 z-50"
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          style={{ transform: 'translateZ(100px) translateX(-50%)' }}
                        >
                          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-2xl">
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
                              {location.activities.map((activity, activityIndex) => (
                                <motion.div
                                  key={activity}
                                  className="flex items-center gap-2 text-sm text-slate-300"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: activityIndex * 0.1 }}
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
                              background: 'linear-gradient(135deg, rgb(15 23 42 / 0.95), rgb(30 41 59 / 0.95))'
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}

              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`palm-${index}`}
                  className="absolute text-2xl opacity-30"
                  style={{
                    left: `${440 + (index % 3) * 25}px`,
                    top: `${380 + Math.floor(index / 3) * 20}px`,
                    transform: 'translateZ(8px)',
                  }}
                  animate={{ rotate: [-5, 5, -5], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🌴
                </motion.div>
              ))}

              {Array.from({ length: 4 }).map((_, index) => (
                <motion.div
                  key={`cloud-${index}`}
                  className="absolute text-4xl opacity-10"
                  style={{
                    left: `${450 + index * 35}px`,
                    top: `${140 + (index % 2) * 20}px`,
                    transform: 'translateZ(40px)',
                  }}
                  animate={{ x: [-10, 10, -10], opacity: [0.05, 0.15, 0.05] }}
                  transition={{ duration: 10 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ☁️
                </motion.div>
              ))}

              {Array.from({ length: 5 }).map((_, index) => (
                <motion.div
                  key={`bird-${index}`}
                  className="absolute text-sm opacity-20"
                  style={{
                    left: `${200 + index * 100}px`,
                    top: `${100 + index * 30}px`,
                    transform: 'translateZ(50px)',
                  }}
                  animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
                  transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                >
                  🦅
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
    </div>
  )
}

export default JourneyMap
