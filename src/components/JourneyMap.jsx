import { useEffect, useState } from 'react'

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

const STEP_DURATIONS = {
  trainOut: 4000,
  road: 5000,
  trainBack: 4000,
}

function JourneyMap() {
  const [step, setStep] = useState(1)
  const [activePulse, setActivePulse] = useState(null)

  useEffect(() => {
    let timers = []

    if (step === 1) {
      timers.push(setTimeout(() => setActivePulse(null), 0))
      timers.push(setTimeout(() => setActivePulse('kochi'), STEP_DURATIONS.trainOut - 400))
      timers.push(setTimeout(() => setStep(2), STEP_DURATIONS.trainOut))
    }

    if (step === 2) {
      timers.push(setTimeout(() => setActivePulse(null), 0))
      timers.push(setTimeout(() => setActivePulse('munnar'), 2200))
      timers.push(setTimeout(() => setActivePulse('alleppey'), 4200))
      timers.push(setTimeout(() => setStep(3), STEP_DURATIONS.road))
    }

    if (step === 3) {
      timers.push(setTimeout(() => setActivePulse(null), 0))
      timers.push(setTimeout(() => setActivePulse('vijayawada'), STEP_DURATIONS.trainBack - 400))
      timers.push(setTimeout(() => setStep(1), STEP_DURATIONS.trainBack + 600))
    }

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [step])

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

        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 700 500"
          role="img"
          aria-label="2D journey map with train, road and backwater routes"
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

          <path
            d={PATHS.train}
            pathLength="1"
            className={`map-route train ${step === 1 ? 'draw-train' : ''} ${step > 1 ? 'route-complete' : ''}`}
          />
          <path
            d={PATHS.road}
            pathLength="1"
            className={`map-route road ${step === 2 ? 'draw-road' : ''} ${step > 2 ? 'route-complete' : ''}`}
          />
          <path
            d={PATHS.trainReturn}
            pathLength="1"
            className={`map-route return ${step === 3 ? 'draw-return' : ''}`}
          />

          <text x="250" y="210" fill="white" fontSize="12" opacity="0.55">150 km</text>
          <text x="470" y="260" fill="white" fontSize="12" opacity="0.55">160 km</text>

          {LOCATIONS.map((location) => (
            <g key={location.id} className={`map-marker ${activePulse === location.id ? 'active' : ''}`}>
              <circle cx={location.x} cy={location.y} r="10" fill={location.color} opacity="0.85" />
              <circle cx={location.x} cy={location.y} r="16" stroke={location.color} strokeWidth="2" fill="none" opacity="0.4" />
              <text x={location.x + 14} y={location.y + 4} fill="white" fontSize="12" fontWeight="600">{location.name}</text>
            </g>
          ))}

          {step === 1 && (
            <g key="train-out">
              <text fontSize="20">🚆
                <animateMotion dur="4s" repeatCount="1" rotate="auto">
                  <mpath href="#trainPath2d" />
                </animateMotion>
              </text>
              <path id="trainPath2d" d={PATHS.train} fill="none" />
            </g>
          )}

          {step === 2 && (
            <g key="car-trip">
              <text fontSize="18">🚗
                <animateMotion dur="5s" repeatCount="1" rotate="auto">
                  <mpath href="#roadPath2d" />
                </animateMotion>
              </text>
              <path id="roadPath2d" d={PATHS.road} fill="none" />
            </g>
          )}

          {step === 3 && (
            <g key="train-return">
              <text fontSize="20">🚆
                <animateMotion dur="4s" repeatCount="1" rotate="auto">
                  <mpath href="#returnPath2d" />
                </animateMotion>
              </text>
              <path id="returnPath2d" d={PATHS.trainReturn} fill="none" />
            </g>
          )}
          <g>
            <text x="540" y="330" fontSize="18">🛶
              <animateTransform attributeName="transform" type="translate" values="0 0; 0 -4; 0 0" dur="3s" repeatCount="indefinite" />
            </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default JourneyMap
