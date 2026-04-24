import { useEffect, useMemo, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const LOCATIONS = [
  { name: 'Vijayawada Railway Station', emoji: '🚉', coords: [16.5193, 80.6305], color: '#60a5fa' },
  { name: 'Kochi', emoji: '🌆', coords: [9.9312, 76.2673], color: '#2dd4bf' },
  { name: 'Munnar', emoji: '⛰️', coords: [10.0889, 77.0595], color: '#4ade80' },
  { name: 'Alleppey', emoji: '🛶', coords: [9.4981, 76.3388], color: '#f59e0b' },
  { name: 'Return Vijayawada', emoji: '🏡', coords: [16.5193, 80.6305], color: '#f87171' },
]

const ROUTE_COLORS = ['#38bdf8', '#34d399', '#f59e0b', '#fb7185']
const ROUTE_POINTS = LOCATIONS.map((place) => place.coords)

function buildCurvePoints(from, to, bend = 0.36, samples = 28) {
  const [x1, y1] = from
  const [x2, y2] = to
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const cLat = mx - dy * bend
  const cLng = my + dx * bend

  const out = []
  for (let step = 0; step <= samples; step += 1) {
    const t = step / samples
    const one = 1 - t
    const lat = one * one * x1 + 2 * one * t * cLat + t * t * x2
    const lng = one * one * y1 + 2 * one * t * cLng + t * t * y2
    out.push([lat, lng])
  }
  return out
}

function buildCurvedSegments(points) {
  return points.slice(0, -1).map((point, idx) => {
    const segment = buildCurvePoints(point, points[idx + 1], idx % 2 === 0 ? 0.34 : -0.3)
    return {
      id: `${idx}-${idx + 1}`,
      points: segment,
      color: ROUTE_COLORS[idx % ROUTE_COLORS.length],
    }
  })
}

function flattenSegments(segments) {
  return segments.flatMap((segment, idx) => (idx === 0 ? segment.points : segment.points.slice(1)))
}

function toSegmentLengths(points) {
  const lengths = []
  let total = 0

  for (let idx = 0; idx < points.length - 1; idx += 1) {
    const [lat1, lng1] = points[idx]
    const [lat2, lng2] = points[idx + 1]
    const len = Math.hypot(lat2 - lat1, lng2 - lng1)
    lengths.push(len)
    total += len
  }

  return { lengths, total }
}

function haversineKm(from, to) {
  const [lat1, lon1] = from
  const [lat2, lon2] = to
  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return 6371 * c
}

function getPointAtProgress(points, lengths, totalLength, progress) {
  if (progress <= 0) return points[0]
  if (progress >= 1) return points[points.length - 1]

  const target = totalLength * progress
  let covered = 0

  for (let idx = 0; idx < lengths.length; idx += 1) {
    const segmentLength = lengths[idx]
    if (covered + segmentLength >= target) {
      const t = (target - covered) / segmentLength
      const [lat1, lng1] = points[idx]
      const [lat2, lng2] = points[idx + 1]
      return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]
    }
    covered += segmentLength
  }

  return points[points.length - 1]
}

function getPartialRoute(points, lengths, totalLength, progress) {
  if (progress <= 0) return [points[0]]
  if (progress >= 1) return points

  const target = totalLength * progress
  const partial = [points[0]]
  let covered = 0

  for (let idx = 0; idx < lengths.length; idx += 1) {
    const segmentLength = lengths[idx]
    const from = points[idx]
    const to = points[idx + 1]

    if (covered + segmentLength < target) {
      partial.push(to)
      covered += segmentLength
      continue
    }

    const t = (target - covered) / segmentLength
    partial.push([
      from[0] + (to[0] - from[0]) * t,
      from[1] + (to[1] - from[1]) * t,
    ])
    break
  }

  return partial
}

function FitRouteBounds() {
  const map = useMap()

  useEffect(() => {
    map.fitBounds(ROUTE_POINTS, {
      padding: [42, 42],
      animate: true,
      duration: 1.2,
    })
  }, [map])

  return null
}

function RealMap() {
  const [drawProgress, setDrawProgress] = useState(0)
  const [dotProgress, setDotProgress] = useState(0)

  const routeSegments = useMemo(() => buildCurvedSegments(ROUTE_POINTS), [])
  const animatedTrack = useMemo(() => flattenSegments(routeSegments), [routeSegments])
  const { lengths, total } = useMemo(() => toSegmentLengths(animatedTrack), [animatedTrack])

  const totalKm = useMemo(() => {
    let sum = 0
    for (let idx = 0; idx < ROUTE_POINTS.length - 1; idx += 1) {
      sum += haversineKm(ROUTE_POINTS[idx], ROUTE_POINTS[idx + 1])
    }
    return Math.round(sum)
  }, [])

  useEffect(() => {
    let frame = null
    const duration = 3100
    const start = performance.now()

    const animate = (time) => {
      const p = Math.min(1, (time - start) / duration)
      setDrawProgress(p)
      if (p < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    let frame = null
    const duration = 11000
    const start = performance.now()

    const animate = (time) => {
      const elapsed = (time - start) % duration
      setDotProgress(elapsed / duration)
      frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const partialRoute = useMemo(
    () => getPartialRoute(animatedTrack, lengths, total, drawProgress),
    [animatedTrack, drawProgress, lengths, total],
  )

  const movingPoint = useMemo(
    () => getPointAtProgress(animatedTrack, lengths, total, dotProgress),
    [animatedTrack, dotProgress, lengths, total],
  )

  return (
    <div className="real-map-wrap">
      <div className="real-map-overlay top">
        <span>🚆 Premium Route View</span>
        <span>{LOCATIONS.length} stops · {totalKm} km</span>
      </div>

      <MapContainer
        center={ROUTE_POINTS[0]}
        zoom={7}
        minZoom={5}
        maxZoom={13}
        className="real-map-container"
        zoomAnimation
        scrollWheelZoom
        dragging={false}
        doubleClickZoom
        touchZoom
        boxZoom={false}
        keyboard={false}
      >
        <FitRouteBounds />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routeSegments.map((segment) => (
          <Polyline
            key={`base-${segment.id}`}
            positions={segment.points}
            pathOptions={{
              color: segment.color,
              weight: 6,
              opacity: 0.68,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        ))}

        <Polyline
          positions={partialRoute}
          pathOptions={{
            color: '#fef3c7',
            weight: 4.5,
            opacity: 0.98,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: '8 8',
          }}
        />

        <CircleMarker
          center={movingPoint}
          radius={7}
          pathOptions={{
            color: '#fde68a',
            fillColor: '#fbbf24',
            fillOpacity: 0.95,
            weight: 2,
          }}
        />

        {LOCATIONS.map((place) => (
          <CircleMarker
            key={place.name}
            center={place.coords}
            radius={11}
            pathOptions={{
              color: place.color,
              fillColor: place.color,
              fillOpacity: 0.18,
              weight: 2,
            }}
          />
        ))}
      </MapContainer>

      <div className="real-map-overlay bottom">
        {LOCATIONS.map((place) => (
          <span key={`chip-${place.name}`} className="real-map-chip">
            {place.emoji} {place.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default RealMap
