import { Fragment, useEffect, useMemo, useState } from 'react'
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const LOCATIONS = [
  { name: 'Vijayawada Railway Station', emoji: '🚉', coords: [16.5193, 80.6305], color: '#60a5fa' },
  { name: 'Kochi', emoji: '🌆', coords: [9.9312, 76.2673], color: '#2dd4bf' },
  { name: 'Munnar', emoji: '⛰️', coords: [10.0889, 77.0595], color: '#4ade80' },
  { name: 'Alleppey', emoji: '🛶', coords: [9.4981, 76.3388], color: '#f59e0b' },
  { name: 'Return Vijayawada', emoji: '🏡', coords: [16.5193, 80.6305], color: '#f87171' },
]

const ROUTE_POINTS = LOCATIONS.map((place) => place.coords)

function createEmojiIcon(emoji) {
  return L.divIcon({
    className: 'leaflet-emoji-marker',
    html: `<div style="font-size:22px;line-height:1">${emoji}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  })
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

  const { lengths, total } = useMemo(() => toSegmentLengths(ROUTE_POINTS), [])

  const totalKm = useMemo(() => {
    let sum = 0
    for (let idx = 0; idx < ROUTE_POINTS.length - 1; idx += 1) {
      sum += haversineKm(ROUTE_POINTS[idx], ROUTE_POINTS[idx + 1])
    }
    return Math.round(sum)
  }, [])

  useEffect(() => {
    let frame = null
    const duration = 2600
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
    () => getPartialRoute(ROUTE_POINTS, lengths, total, drawProgress),
    [drawProgress, lengths, total],
  )

  const movingPoint = useMemo(
    () => getPointAtProgress(ROUTE_POINTS, lengths, total, dotProgress),
    [dotProgress, lengths, total],
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
      >
        <FitRouteBounds />
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <Polyline
          positions={ROUTE_POINTS}
          pathOptions={{
            color: '#334155',
            weight: 6,
            opacity: 0.55,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />

        <Polyline
          positions={partialRoute}
          pathOptions={{
            color: '#d4a853',
            weight: 4,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: '10 8',
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
          <Fragment key={place.name}>
            <CircleMarker
              center={place.coords}
              radius={11}
              pathOptions={{
                color: place.color,
                fillColor: place.color,
                fillOpacity: 0.18,
                weight: 2,
              }}
            />
            <Marker position={place.coords} icon={createEmojiIcon(place.emoji)}>
              <Popup>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {place.emoji} {place.name}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>Route stop</div>
                </div>
              </Popup>
            </Marker>
          </Fragment>
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
