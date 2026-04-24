const INDIA_MAP_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/India_location_map.svg/1280px-India_location_map.svg.png'

const LOCATIONS = {
  vijayawada: { x: 67.5, y: 50.5, label: 'Vijayawada' },
  kochi: { x: 49.2, y: 80.2, label: 'Kochi' },
  munnar: { x: 50.8, y: 74.8, label: 'Munnar' },
  alleppey: { x: 49.1, y: 84.1, label: 'Alleppey' },
}

const FORWARD_PATH = 'M67.5 50.5 C60 58, 53 70, 49.2 80.2 C49.8 78.5, 50.3 76.8, 50.8 74.8 C50.2 77.6, 49.6 80.8, 49.1 84.1'
const RETURN_PATH = 'M49.2 80.2 C55 68, 60.8 59, 67.5 50.5'

function getActiveStop(progress) {
  if (progress < 20) return 'vijayawada'
  if (progress < 48) return 'kochi'
  if (progress < 75) return 'munnar'
  return 'alleppey'
}

function labelProps(id, x, y) {
  if (id === 'vijayawada') return { x: x + 2.3, y: y - 2.3, anchor: 'start' }
  if (id === 'kochi') return { x: x - 2, y: y + 4.5, anchor: 'end' }
  if (id === 'munnar') return { x: x + 2.2, y: y - 3, anchor: 'start' }
  return { x: x + 2.2, y: y + 4.2, anchor: 'start' }
}

function JourneyMap({ progress = 0 }) {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0))
  const activeStop = getActiveStop(safeProgress)

  return (
    <div className="journey-map-fullbleed">
      <div className="journey-map-stack">
        <img src={INDIA_MAP_IMAGE} alt="Map of India" className="journey-map-image" loading="lazy" />
        <svg
          viewBox="0 0 100 100"
          className="journey-map-svg overlay"
          role="img"
          aria-label="Journey route from Vijayawada to Kochi, Munnar, Alleppey and return to Vijayawada"
        >
          <defs>
            <linearGradient id="journey-forward-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#d4a853" />
            </linearGradient>
          </defs>

          <path d={FORWARD_PATH} className="journey-forward-base" />
          <path
            d={FORWARD_PATH}
            className="journey-forward-progress"
            pathLength="100"
            style={{ strokeDasharray: `${safeProgress} 100` }}
          />

          <path d={RETURN_PATH} className="journey-return-path" />

          {Object.entries(LOCATIONS).map(([id, location]) => {
            const active = id === activeStop
            const label = labelProps(id, location.x, location.y)
            return (
              <g key={id}>
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={active ? 2.2 : 1.4}
                  className={`journey-marker ${active ? 'active' : ''}`}
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor={label.anchor}
                  className={`journey-label ${active ? 'active' : ''}`}
                >
                  {location.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="journey-map-legend">
        <span><i className="legend-stroke forward" /> Forward Journey</span>
        <span><i className="legend-stroke return" /> Return Journey (May 26, 6:00 PM)</span>
      </div>
    </div>
  )
}

export default JourneyMap
