import { useMemo } from 'react'

const LOCATIONS = [
  { id: 'vijayawada', x: 18, y: 28, label: 'Vijayawada' },
  { id: 'kochi', x: 42, y: 43, label: 'Kochi' },
  { id: 'munnar', x: 58, y: 26, label: 'Munnar' },
  { id: 'alleppey', x: 74, y: 52, label: 'Alleppey' },
]

const TRAIN_PATH = 'M18 28 C26 29, 33 35, 42 43'
const ROAD_PATH = 'M42 43 C49 38, 52 31, 58 26 C64 24, 69 38, 74 52 C67 48, 56 45, 42 43'
const RETURN_PATH = 'M42 43 C32 37, 24 32, 18 28'
const BOAT_PATH = 'M72 52 C77 48, 79 56, 74 60 C69 64, 66 56, 72 52'

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function getActiveStop(progress) {
  if (progress < 22) return 'vijayawada'
  if (progress < 48) return 'kochi'
  if (progress < 72) return 'munnar'
  return 'alleppey'
}

function JourneyMap({ progress = 0 }) {
  const safeProgress = clamp(Number(progress) || 0, 0, 100)
  const activeStop = useMemo(() => getActiveStop(safeProgress), [safeProgress])

  const trainDash = `${clamp(safeProgress * 0.6, 0, 100)} 100`
  const roadDash = `${clamp((safeProgress - 20) * 0.9, 0, 100)} 100`
  const returnDash = `${clamp((safeProgress - 72) * 0.7, 0, 100)} 100`

  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ 3D Isometric Journey Map</div>
        <p className="journey-iso-copy">A small 3D world for the trip route, built only with CSS, SVG, and layered terrain.</p>
      </div>

      <div className="journey-iso-scene">
        <div className="journey-iso-bgtext" aria-hidden="true">JOURNEY</div>

        <div className="journey-iso-world" aria-hidden="true">
          <div className="terrain-layer terrain-base" />
          <div className="terrain-layer terrain-water kochi-water" />
          <div className="terrain-layer terrain-water alleppey-water" />
          <div className="terrain-layer terrain-city vijayawada-city" />
          <div className="terrain-layer terrain-hills munnar-hills" />
          <div className="terrain-layer terrain-green ridge-a" />
          <div className="terrain-layer terrain-green ridge-b" />
          <div className="terrain-layer terrain-shadow" />

          <svg
            viewBox="0 0 100 100"
            className="journey-iso-svg"
            role="img"
            aria-label="Isometric journey map showing train, road and boat route"
          >
            <defs>
              <linearGradient id="trainGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#5eead4" />
                <stop offset="100%" stopColor="#d4a853" />
              </linearGradient>
              <linearGradient id="roadGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
              <linearGradient id="waterGlow" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>

            <path d={TRAIN_PATH} className="iso-path train-path-base" />
            <path d={TRAIN_PATH} className="iso-path train-path-forward" pathLength="100" style={{ strokeDasharray: trainDash }} />

            <path d={ROAD_PATH} className="iso-path road-path-base" />
            <path d={ROAD_PATH} className="iso-path road-path-highlight" pathLength="100" style={{ strokeDasharray: roadDash }} />

            <path d={RETURN_PATH} className="iso-path return-path" pathLength="100" style={{ strokeDasharray: returnDash }} />

            <path d={BOAT_PATH} className="iso-path boat-path" />

            <g>
              {LOCATIONS.map((location) => (
                <g key={location.id}>
                  <circle
                    cx={location.x}
                    cy={location.y}
                    r={activeStop === location.id ? 2.5 : 1.8}
                    className={`iso-marker ${activeStop === location.id ? 'active' : ''}`}
                  />
                  <text
                    x={location.x + (location.id === 'vijayawada' ? 2 : 2)}
                    y={location.y + (location.id === 'vijayawada' ? -4 : location.id === 'alleppey' ? 5 : -4)}
                    className={`iso-label ${activeStop === location.id ? 'active' : ''}`}
                  >
                    {location.label}
                  </text>
                </g>
              ))}
            </g>

            <g className="iso-mover train-mover">
              <text className="iso-icon">🚆</text>
              <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                <mpath href="#train-mpath" />
              </animateMotion>
            </g>

            <path id="train-mpath" d={TRAIN_PATH} fill="none" />

            <g className="iso-mover car-mover">
              <text className="iso-icon">🚗</text>
              <animateMotion dur="10s" repeatCount="indefinite" rotate="auto">
                <mpath href="#road-mpath" />
              </animateMotion>
            </g>

            <path id="road-mpath" d={ROAD_PATH} fill="none" />

            <g className="iso-mover boat-mover">
              <text className="iso-icon">🛶</text>
              <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
                <mpath href="#boat-mpath" />
              </animateMotion>
            </g>

            <path id="boat-mpath" d={BOAT_PATH} fill="none" />
          </svg>
        </div>
      </div>

      <div className="journey-iso-legend">
        <span><i className="legend-stroke train" /> Train path</span>
        <span><i className="legend-stroke road" /> Road path</span>
        <span><i className="legend-stroke return" /> Return path</span>
      </div>
    </div>
  )
}

export default JourneyMap
