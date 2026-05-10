import { useState } from 'react'
import { motion } from 'framer-motion'

const LOCATIONS = [
  {
    id: 'vijayawada',
    name: 'Vijayawada',
    emoji: '🏠',
    x: 200,
    y: 100,
    color: '#f59e0b',
    type: 'start',
    date: 'May 22, 3:50 AM',
    description: 'Journey Begins',
  },
  {
    id: 'kochi',
    name: 'Kochi',
    emoji: '🌆',
    x: 150,
    y: 350,
    color: '#f59e0b',
    type: 'arrival',
    date: 'May 23, 2:00 AM',
    description: 'Gateway to Kerala',
  },
  {
    id: 'munnar',
    name: 'Munnar',
    emoji: '⛰️',
    x: 500,
    y: 200,
    color: '#f59e0b',
    type: 'destination',
    date: 'May 23-24',
    description: 'Tea Gardens & Hills',
  },
  {
    id: 'alleppey',
    name: 'Alleppey',
    emoji: '🛶',
    x: 480,
    y: 380,
    color: '#f59e0b',
    type: 'destination',
    date: 'May 25',
    description: 'Backwater Paradise',
  },
]

const PATHS = {
  train: 'M 200,100 Q 150,200 150,350',
  roadToMunnar: 'M 150,350 Q 300,250 500,200',
  roadToAlleppey: 'M 500,200 Q 520,280 480,380',
  roadBackToKochi: 'M 480,380 Q 350,400 150,350',
  trainReturn: 'M 150,350 Q 150,200 200,100',
  carLoop: 'M 150,350 Q 300,250 500,200 Q 520,280 480,380 Q 350,400 150,350',
}

function JourneyMap() {
  const [hoveredLocation, setHoveredLocation] = useState(null)

  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ Kerala Journey Map</div>
        <p className="journey-iso-copy">3D isometric route from Vijayawada to Kerala highlights. May 22-26, 2026.</p>
      </div>

      <div className="relative w-full h-[520px] md:h-[640px]">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
        >
          <div
            className="relative w-full max-w-4xl h-full"
            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(-45deg) scale(1.05)' }}
          >
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 700 500"
              role="img"
              aria-label="3D isometric Kerala journey map with train, road and backwater routes"
              style={{ transform: 'translateZ(0px)' }}
            >
              <defs>
                <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
              </defs>

              <rect x="0" y="0" width="700" height="500" fill="url(#oceanGradient)" />

              <ellipse cx="350" cy="280" rx="280" ry="180" fill="url(#landGradient)" opacity="0.95" />

              <ellipse cx="500" cy="200" rx="120" ry="80" fill="#4ade80" opacity="0.8" />

              <ellipse cx="480" cy="380" rx="90" ry="50" fill="#3b82f6" opacity="0.7">
                <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="440" cy="360" rx="30" ry="20" fill="#60a5fa" opacity="0.6" />
              <ellipse cx="520" cy="400" rx="25" ry="15" fill="#60a5fa" opacity="0.6" />

              <motion.path
                d={PATHS.train}
                stroke="#ec4899"
                strokeWidth="3"
                strokeDasharray="10 5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 2, delay: 0.5 }}
              />

              <motion.path
                d={PATHS.roadToMunnar}
                stroke="#6b7280"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />

              <motion.path
                d={PATHS.roadToAlleppey}
                stroke="#6b7280"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />

              <motion.path
                d={PATHS.roadBackToKochi}
                stroke="#6b7280"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="5 3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 2 }}
              />

              <motion.path
                d={PATHS.trainReturn}
                stroke="#a78bfa"
                strokeWidth="2"
                strokeDasharray="8 4"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 2.5 }}
              />

              <text x="250" y="180" fill="white" fontSize="10" opacity="0.6">150 km</text>
              <text x="450" y="290" fill="white" fontSize="10" opacity="0.6">160 km</text>

              <path id="trainPath" d={PATHS.train} fill="none" />
              <path id="carPath" d={PATHS.carLoop} fill="none" />
              <path id="trainReturnPath" d={PATHS.trainReturn} fill="none" />
            </svg>

            <div
              className="absolute bg-slate-600 rounded-sm"
              style={{ left: '180px', top: '85px', width: '20px', height: '30px', transform: 'translateZ(15px)', boxShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}
            />
            <div
              className="absolute bg-slate-500 rounded-sm"
              style={{ left: '205px', top: '95px', width: '18px', height: '25px', transform: 'translateZ(12px)', boxShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}
            />
            <div
              className="absolute bg-slate-500 rounded-sm"
              style={{ left: '130px', top: '340px', width: '18px', height: '28px', transform: 'translateZ(14px)', boxShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}
            />
            <div
              className="absolute bg-slate-600 rounded-sm"
              style={{ left: '152px', top: '348px', width: '16px', height: '22px', transform: 'translateZ(11px)', boxShadow: '4px 4px 8px rgba(0,0,0,0.5)' }}
            />

            <motion.div
              className="absolute text-2xl"
              style={{ left: '480px', top: '380px' }}
              animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🛶
            </motion.div>

            <div className="seq-vehicle seq-train" style={{ offsetPath: `path('${PATHS.train}')` }}>🚆</div>
            <div className="seq-vehicle seq-car" style={{ offsetPath: `path('${PATHS.carLoop}')` }}>🚗</div>
            <div className="seq-vehicle seq-train-return" style={{ offsetPath: `path('${PATHS.trainReturn}')` }}>🚆</div>

            {LOCATIONS.map((location, index) => (
              <motion.div
                key={location.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${location.x}px`,
                  top: `${location.y}px`,
                  transformStyle: 'preserve-3d',
                  transform: 'translate3d(-50%, -50%, 20px)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.3 + 1, duration: 0.5 }}
                whileHover={{ scale: 1.2 }}
                onHoverStart={() => setHoveredLocation(location.id)}
                onHoverEnd={() => setHoveredLocation(null)}
              >
                <motion.div
                  className="absolute -inset-3 rounded-full border-2 opacity-50"
                  style={{ borderColor: location.color }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                />

                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: location.color, boxShadow: `0 0 20px ${location.color}80` }}
                >
                  <span className="text-lg">{location.emoji}</span>
                </div>

                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                  <div className="text-white text-xs md:text-sm font-bold">{location.name}</div>
                </div>

                {hoveredLocation === location.id && (
                  <motion.div
                    className="absolute -top-20 left-1/2 -translate-x-1/2 bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 border border-slate-700 shadow-2xl z-50 min-w-[160px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ transform: 'translateZ(50px) translateX(-50%)' }}
                  >
                    <div className="text-white text-xs font-semibold mb-1">{location.name}</div>
                    <div className="text-slate-300 text-xs mb-1">{location.date}</div>
                    <div className="text-slate-400 text-xs">{location.description}</div>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`palm-${index}`}
                className="absolute text-2xl opacity-40"
                style={{ left: `${440 + index * 20}px`, top: `${350 + (index % 2) * 15}px`, transform: 'translateZ(5px)' }}
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ duration: 3 + index * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🌴
              </motion.div>
            ))}

            {Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={`cloud-${index}`}
                className="absolute text-3xl opacity-20"
                style={{ left: `${460 + index * 30}px`, top: `${160 + index * 10}px`, transform: 'translateZ(30px)' }}
                animate={{ x: [0, 10, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                ☁️
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="mt-6 flex flex-wrap justify-center gap-6 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-0.5 bg-pink-500 rounded"
            style={{ backgroundImage: 'repeating-linear-gradient(to right, #ec4899 0, #ec4899 10px, transparent 10px, transparent 15px)' }}
          />
          <span className="text-slate-400">Train Journey</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0.5 bg-gray-500 rounded" />
          <span className="text-slate-400">Road Route</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-slate-400">Destinations</span>
        </div>
      </motion.div>
    </div>
  )
}

export default JourneyMap
