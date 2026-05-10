const LOCATIONS = [
  { id: 'vijayawada', x: 150, y: 100, z: 50, label: 'Vijayawada', icon: '🏠' },
  { id: 'kochi', x: 200, y: 500, z: 10, label: 'Kochi', icon: '🌆' },
  { id: 'munnar', x: 700, y: 200, z: 150, label: 'Munnar', icon: '⛰️' },
  { id: 'alleppey', x: 750, y: 400, z: 5, label: 'Alleppey', icon: '🛶' },
]

const TRAIN_TO_KOCHI = 'M 150,100 Q 100,300 200,500'
const ROAD_TO_MUNNAR = 'M 200,500 Q 400,300 700,200'
const ROAD_TO_ALLEPPEY = 'M 700,200 Q 750,300 750,400'
const ROAD_BACK_KOCHI = 'M 750,400 Q 500,450 200,500'
const TRAIN_RETURN = 'M 200,500 Q 100,300 150,100'
const CAR_LOOP = 'M 200,500 Q 400,300 700,200 Q 750,300 750,400 Q 500,450 200,500'

function JourneyMap() {
  const toPercent = (value, max) => `${(value / max) * 100}%`

  return (
    <div className="journey-iso-card glass-card">
      <div className="journey-iso-top">
        <div className="badge" style={{ marginBottom: 8 }}>🗺️ Kerala Journey Map</div>
        <p className="journey-iso-copy">3D isometric route from Vijayawada to Kerala highlights. May 22-26, 2026.</p>
      </div>

      <div className="journey-iso-scene kerala-iso-scene">
        <div className="journey-iso-bgtext" aria-hidden="true">KERALA JOURNEY</div>

        <div className="journey-iso-world kerala-iso-world" aria-hidden="true">
          <div className="kerala-iso-plane">
            <svg
              className="kerala-iso-svg"
              viewBox="0 0 1000 700"
              role="img"
              aria-label="3D isometric Kerala journey map with train, road and backwater routes"
            >
              <defs>
                <linearGradient id="landGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6b7280" />
                  <stop offset="45%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="trainGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148, 163, 184, 0.18)" strokeWidth="1" />
                </pattern>
              </defs>

              <rect x="0" y="0" width="1000" height="700" fill="#1e3a5f" />
              <rect x="0" y="0" width="1000" height="700" fill="url(#gridPattern)" opacity="0.25" />

              <path
                d="M 100,60 L 380,60 L 900,300 L 900,640 L 320,640 L 100,400 Z"
                fill="url(#landGradient)"
                opacity="0.92"
              />

              <ellipse cx="720" cy="210" rx="170" ry="110" fill="#34d399" opacity="0.85" />
              <g fill="#10b981" opacity="0.9">
                {Array.from({ length: 24 }).map((_, index) => (
                  <rect key={`tea-${index}`} x={640 + (index % 6) * 18} y={165 + Math.floor(index / 6) * 16} width="12" height="8" rx="2" />
                ))}
              </g>

              <g fill="#3b82f6" opacity="0.8">
                <ellipse cx="760" cy="400" rx="110" ry="70" />
                <ellipse cx="700" cy="430" rx="70" ry="45" opacity="0.65" />
              </g>

              <g className="iso-water-ripples">
                <circle cx="760" cy="400" r="18" />
                <circle cx="760" cy="400" r="32" />
                <circle cx="700" cy="430" r="20" />
              </g>

              <g className="iso-mountains" fill="#34d399">
                <polygon points="650,230 700,120 750,230" />
                <polygon points="720,240 770,140 820,240" />
              </g>

              <path d={TRAIN_TO_KOCHI} className="iso-path train-path" />
              <path d={TRAIN_RETURN} className="iso-path train-return" />

              <path d={ROAD_TO_MUNNAR} className="iso-path road-path" />
              <path d={ROAD_TO_ALLEPPEY} className="iso-path road-path" />
              <path d={ROAD_BACK_KOCHI} className="iso-path road-path" />

              <text x="120" y="300" className="iso-path-label">22h Train Journey</text>
              <text x="430" y="280" className="iso-path-label">150 km</text>
              <text x="740" y="320" className="iso-path-label">160 km</text>
              <text x="500" y="470" className="iso-path-label">75 km</text>

              <g>
                {LOCATIONS.map((location) => (
                  <g key={location.id}>
                    <circle cx={location.x} cy={location.y} r="10" className="iso-marker" />
                    <text x={location.x + 14} y={location.y - 12} className="iso-label">{location.label}</text>
                  </g>
                ))}
              </g>

              <g className="iso-mover train-mover">
                <text className="iso-icon">🚆</text>
                <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" keySplines="0.42 0 0.58 1" keyTimes="0;1" calcMode="spline">
                  <mpath href="#train-path" />
                </animateMotion>
              </g>

              <g className="iso-mover train-smoke">
                <text className="iso-icon">💨</text>
                <animateMotion dur="8s" repeatCount="indefinite" rotate="auto" begin="0.2s">
                  <mpath href="#train-path" />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
              </g>

              <path id="train-path" d={TRAIN_TO_KOCHI} fill="none" />

              <g className="iso-mover car-mover">
                <text className="iso-icon">🚗</text>
                <animateMotion dur="12s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#car-path" />
                </animateMotion>
              </g>

              <path id="car-path" d={CAR_LOOP} fill="none" />
            </svg>

            <div className="kerala-iso-overlay">
              {LOCATIONS.map((location) => (
                <div
                  key={`${location.id}-icon`}
                  className="iso-icon-marker"
                  style={{
                    left: toPercent(location.x, 1000),
                    top: toPercent(location.y, 700),
                    '--z': `${location.z}px`,
                  }}
                >
                  {location.icon}
                </div>
              ))}

              <div className="iso-building" style={{ left: toPercent(150, 1000), top: toPercent(120, 700), '--z': '48px', '--w': '26px', '--h': '32px' }} />
              <div className="iso-building" style={{ left: toPercent(175, 1000), top: toPercent(130, 700), '--z': '38px', '--w': '18px', '--h': '26px' }} />
              <div className="iso-building" style={{ left: toPercent(210, 1000), top: toPercent(520, 700), '--z': '22px', '--w': '22px', '--h': '28px' }} />
              <div className="iso-building" style={{ left: toPercent(235, 1000), top: toPercent(500, 700), '--z': '18px', '--w': '18px', '--h': '22px' }} />

              <div className="iso-boat" style={{ left: toPercent(760, 1000), top: toPercent(405, 700) }}>🛶</div>
              <div className="iso-palm" style={{ left: toPercent(720, 1000), top: toPercent(445, 700) }}>🌴</div>
              <div className="iso-palm" style={{ left: toPercent(790, 1000), top: toPercent(430, 700) }}>🌴</div>

              <div className="iso-cloud cloud-a">☁️</div>
              <div className="iso-cloud cloud-b">☁️</div>
              <div className="iso-birds">•••</div>
            </div>
          </div>
        </div>
      </div>

      <div className="journey-iso-legend">
        <span><i className="legend-stroke train" /> Train (Vijayawada → Kochi)</span>
        <span><i className="legend-stroke road" /> Road (Kochi → Munnar → Alleppey → Kochi)</span>
        <span><i className="legend-stroke return" /> Return train (Kochi → Vijayawada)</span>
      </div>
    </div>
  )
}

export default JourneyMap
