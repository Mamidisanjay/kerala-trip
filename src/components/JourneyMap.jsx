const LOCATIONS = {
  vijayawada: { x: 70, y: 45, label: 'Vijayawada' },
  kochi: { x: 45, y: 75, label: 'Kochi' },
  munnar: { x: 50, y: 65, label: 'Munnar' },
  alleppey: { x: 48, y: 80, label: 'Alleppey' },
}

const INDIA_PATH =
  'M20 8 L29 10 L38 16 L47 22 L57 28 L64 37 L66 45 L63 54 L58 63 L53 70 L49 78 L44 88 L38 92 L31 88 L25 78 L22 66 L20 54 L18 42 L17 30 L18 18 Z'

const FORWARD_PATH = 'M70 45 C63 53, 53 65, 45 75 C47 71, 49 68, 50 65 C49 69, 48 74, 48 80'
const RETURN_PATH = 'M45 75 C52 67, 61 55, 70 45'

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
      <div className="journey-map-bg-text" aria-hidden="true">INDIA → KERALA</div>
      <svg
        viewBox="0 0 100 100"
        className="journey-map-svg"
        role="img"
        aria-label="Journey route from Vijayawada to Kochi, Munnar, Alleppey and return to Vijayawada"
      >
        <defs>
          <linearGradient id="journey-forward-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#d4a853" />
          </linearGradient>
        </defs>

        <path d={INDIA_PATH} className="journey-india-outline" />

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

      <div className="journey-map-legend">
        <span><i className="legend-stroke forward" /> Forward Journey</span>
        <span><i className="legend-stroke return" /> Return Journey (May 26, 6:00 PM)</span>
      </div>
    </div>
  )
}

export default JourneyMap
