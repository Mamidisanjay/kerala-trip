import { useEffect, useMemo, useRef, useState } from 'react'
import Gallery from './components/Gallery'
import CarouselSection from './components/CarouselSection'
import './App.css'

const DEPARTURE = new Date('2026-05-22T04:00:00+05:30')
const TRIP_END = new Date('2026-05-26T20:00:00+05:30')
const PACKING_STORAGE_KEY = 'kerala-pack'
const MOOD_STORAGE_KEY = 'kerala-vibe'

const moodModes = [
  {
    id: 'night',
    label: 'Classic Night',
    icon: '🌙',
    bg:
      'radial-gradient(circle at 15% 20%, rgba(0,184,156,0.12), transparent 45%), radial-gradient(circle at 85% 10%, rgba(232,200,122,0.14), transparent 48%), linear-gradient(180deg, #040e08 0%, #0a1f12 45%, #040e08 100%)',
    rain: false,
  },
  {
    id: 'sunrise',
    label: 'Sunrise Glow',
    icon: '🌅',
    bg:
      'radial-gradient(circle at 20% 15%, rgba(240,160,48,0.22), transparent 50%), radial-gradient(circle at 85% 8%, rgba(224,96,48,0.18), transparent 55%), linear-gradient(180deg, #1b0c05 0%, #3d1b0d 50%, #0a1f12 100%)',
    rain: false,
  },
  {
    id: 'monsoon',
    label: 'Monsoon Drift',
    icon: '🌧',
    bg:
      'radial-gradient(circle at 20% 20%, rgba(46,110,166,0.22), transparent 52%), radial-gradient(circle at 80% 10%, rgba(0,184,156,0.12), transparent 55%), linear-gradient(180deg, #050d14 0%, #0a1f12 52%, #040b10 100%)',
    rain: true,
  },
]

const facts = [
  '"Kerala has the highest literacy rate in India — over 96%. Even the tea gardens have schools nestled between the bushes."',
  '"The backwaters of Kerala stretch over 900 km — a labyrinth of lagoons, lakes, and rivers that mirror the sky."',
  '"Munnar\'s tea estates were planted by British colonists in the 1880s. Today they still produce some of India\'s finest teas."',
  '"Kerala receives rainfall from both the southwest and northeast monsoons — making it one of the greenest places on Earth."',
  '"The Chinese fishing nets in Kochi have stood since the 14th century, brought by traders from the court of Kublai Khan."',
  '"Kerala is called \'God\'s Own Country\' — a name born from its breathtaking natural beauty and timeless divine serenity."',
  '"The Alleppey houseboat — kettuvallam — is a traditional rice barge repurposed into a floating home. No nails, just woven coir."',
  '"Munnar sits at 1,600 metres above sea level. On clear mornings you can see the clouds below you, not above."',
]

const timelineStops = [
  {
    date: '22 May · 04:00 AM',
    title: '🚂 Night Train Departure',
    text:
      'The journey begins before sunrise. A stillness blankets Vijayawada as the train breathes to life — rolling southward through sleeping towns, stars guiding the way.',
    badge: 'Vijayawada Station',
    dot: '🌙',
  },
  {
    date: '23 May · 02:00 AM',
    title: '🛬 Arrival in Kochi',
    text:
      'A quiet arrival into God\'s Own Country. The air smells different — salt and spice. Kochi awaits with its glowing harbour and ancient colonial charm.',
    badge: 'Ernakulam Junction',
    dot: '🌆',
  },
  {
    date: '23–24 May · 2 Days',
    title: '🍃 Munnar Hill Station',
    text:
      'Lost in the hills, wrapped in clouds. Endless tea estates roll across misty ridges — waterfalls hidden in the folds of ancient peaks. Time slows here.',
    badge: 'Tea Gardens · Waterfalls · Fog',
    dot: '🌿',
  },
  {
    date: '25 May · Morning',
    title: '🛣 Drive to Alleppey',
    text:
      'From mountains to backwaters — a winding road through rubber plantations and paddy fields, descending toward the shimmering lagoons of Alleppey.',
    badge: '~3 Hour Mountain Drive',
    dot: '🚗',
  },
  {
    date: '25 May · Overnight',
    title: '🚤 Alleppey Houseboat',
    text:
      'Floating through paradise. The houseboat glides silently through emerald backwaters as the sun melts into the horizon — a memory that will last forever.',
    badge: 'Backwaters · Sunset · Stars',
    dot: '🌊',
    ripple: true,
  },
  {
    date: '26 May · Return',
    title: '🚆 Homeward Bound',
    text:
      'Taking memories back home. The return path glows with gratitude — every station passed is a chapter closed. Kerala stays in your heart long after you leave.',
    badge: 'Kochi → Vijayawada',
    dot: '🏠',
  },
]

const dayCards = [
  {
    icon: '🌅',
    day: 'Day 1 · 23 May',
    title: 'Cochin to Munnar',
    text: 'A sunrise drive through winding roads, gaining altitude as the world turns green. The first glimpse of mist rolling over tea-carpeted hills.',
    tags: ['Road Trip', 'Tea Gardens', 'Misty Hills'],
  },
  {
    icon: '🍃',
    day: 'Day 2 · 24 May',
    title: 'Munnar Sightseeing',
    text: 'Eravikulam, Mattupetty Dam, Echo Point — every turn reveals a new layer of Munnar\'s ancient, mist-wrapped beauty and wildlife.',
    tags: ['Waterfalls', 'Wildlife', 'Viewpoints'],
  },
  {
    icon: '🚤',
    day: 'Day 3 · 25 May',
    title: 'Alleppey Backwaters',
    text: 'A houseboat drifts silently through Kerala\'s Venice. Palm fronds sway at eye level. Kingfishers dart. The evening sky turns molten gold.',
    tags: ['Houseboat', 'Sunset', 'Lagoons'],
  },
  {
    icon: '⚓',
    day: 'Day 4 · 26 May',
    title: 'Cochin & Return',
    text: 'Fort Kochi\'s Chinese fishing nets at dawn, the colonial spice streets, and then — the train back north. Kerala stays in the soul forever.',
    tags: ['Fort Kochi', 'Spice Market', 'Homeward'],
  },
]

const packingItems = [
  'Passport & ID',
  'Travel Insurance',
  'Sunscreen SPF50',
  'Insect Repellent',
  'Light Rain Jacket',
  'Comfortable Shoes',
  'Swimming Gear',
  'Power Bank',
  'Camera & Memory Cards',
  'Medicines Kit',
  'Sunglasses',
  'Kerala Map / Offline',
  'Cash (INR)',
  'Light Clothes (4 days)',
  'Reusable Water Bottle',
  'Earphones',
]

const memories = [
  { cat: 'train', emoji: '🚂', caption: 'Midnight departure', rot: '-2deg' },
  { cat: 'train', emoji: '🌙', caption: 'Stars through the window', rot: '1.5deg' },
  { cat: 'train', emoji: '☕', caption: 'Platform chai at 3 AM', rot: '-0.5deg' },
  { cat: 'munnar', emoji: '🍃', caption: 'Endless tea estates', rot: '-1deg' },
  { cat: 'munnar', emoji: '🌫', caption: 'Lost in the mist', rot: '2deg' },
  { cat: 'munnar', emoji: '💧', caption: 'Hidden waterfall', rot: '-1.5deg' },
  { cat: 'munnar', emoji: '🌿', caption: 'Tea picker at work', rot: '1deg' },
  { cat: 'houseboat', emoji: '🚤', caption: 'Floating at dusk', rot: '1deg' },
  { cat: 'houseboat', emoji: '🌅', caption: 'Backwater sunset', rot: '-2.5deg' },
  { cat: 'houseboat', emoji: '🌊', caption: 'Water reflections', rot: '0.5deg' },
  { cat: 'houseboat', emoji: '🦆', caption: 'Morning on the lagoon', rot: '-1deg' },
  { cat: 'friends', emoji: '🤗', caption: 'Us on the bridge', rot: '-1deg' },
  { cat: 'friends', emoji: '😄', caption: 'Chai & laughter', rot: '2deg' },
  { cat: 'friends', emoji: '📸', caption: 'That perfect shot', rot: '-0.5deg' },
  { cat: 'friends', emoji: '🎉', caption: 'Celebrating arrival', rot: '1.5deg' },
]

const memoryFilters = [
  { id: 'all', label: 'All Memories' },
  { id: 'train', label: 'Train Journey' },
  { id: 'munnar', label: 'Munnar Vibes' },
  { id: 'houseboat', label: 'Houseboat' },
  { id: 'friends', label: 'Friends & Fun' },
]

const phaseCopy = {
  before: {
    label: 'Trip begins in',
    banner: 'May 22 – 26, 2026 · God\'s Own Country',
  },
  journey: {
    label: 'Journey in motion',
    banner: 'The journey is live — Kerala is calling',
  },
  after: {
    label: 'Memories live on',
    banner: 'The trip is complete — relive the story',
  },
}

function pad(value) {
  return String(Math.max(0, Math.floor(value))).padStart(2, '0')
}

function buildStars() {
  return Array.from({ length: 200 }, (_, idx) => {
    const size = Math.random() * 2.5 + 0.4
    return {
      id: idx,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 78}%`,
        '--d': `${Math.random() * 3 + 1.5}s`,
        '--delay': `${Math.random() * 5}s`,
        '--op': `${Math.random() * 0.7 + 0.1}`,
      },
    }
  })
}

function buildRain() {
  return Array.from({ length: 90 }, (_, idx) => {
    const height = Math.random() * 80 + 40
    return {
      id: idx,
      style: {
        left: `${Math.random() * 100}%`,
        height: `${height}px`,
        '--dur': `${(Math.random() * 0.5 + 0.4).toFixed(2)}s`,
        '--delay': `${(Math.random() * 2).toFixed(2)}s`,
      },
    }
  })
}

function buildMeteors() {
  return Array.from({ length: 20 }, (_, idx) => ({
    id: idx,
    style: {
      top: `${Math.random() * 40}%`,
      left: `${Math.random() * 80 + 10}%`,
      height: `${Math.random() * 60 + 30}px`,
      animationDelay: `${Math.random().toFixed(2)}s`,
      transform: `rotate(${Math.random() * 20 + 30}deg)`,
    },
  }))
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [factIndex, setFactIndex] = useState(0)
  const [activeMood, setActiveMood] = useState(() => {
    if (typeof window === 'undefined') return 'night'
    const stored = window.localStorage.getItem(MOOD_STORAGE_KEY)
    return moodModes.some((mode) => mode.id === stored) ? stored : 'night'
  })
  const [activeFilter, setActiveFilter] = useState('all')
  const [packingState, setPackingState] = useState(() => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(window.localStorage.getItem(PACKING_STORAGE_KEY) || '{}')
    } catch {
      return {}
    }
  })
  const [musicOn, setMusicOn] = useState(false)
  const [moonTaps, setMoonTaps] = useState(0)
  const [meteorShower, setMeteorShower] = useState(false)

  const stars = useMemo(() => buildStars(), [])
  const rainDrops = useMemo(() => buildRain(), [])
  const meteors = useMemo(() => buildMeteors(), [])

  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const starsRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onMove = (event) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${event.clientX}px`
        cursorRef.current.style.top = `${event.clientY}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${event.clientX}px`
        ringRef.current.style.top = `${event.clientY}px`
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (starsRef.current) {
        starsRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('.tl-item, .day-card')
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12 },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const selected = moodModes.find((mode) => mode.id === activeMood) || moodModes[0]
    document.body.style.background = selected.bg
    window.localStorage.setItem(MOOD_STORAGE_KEY, activeMood)
  }, [activeMood])

  useEffect(() => {
    window.localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(packingState))
  }, [packingState])

  useEffect(() => {
    if (!meteorShower) return undefined
    const timer = setTimeout(() => setMeteorShower(false), 2000)
    return () => clearTimeout(timer)
  }, [meteorShower])

  const phase = useMemo(() => {
    if (now < DEPARTURE) return 'before'
    if (now <= TRIP_END) return 'journey'
    return 'after'
  }, [now])

  const countdown = useMemo(() => {
    const diff = Math.max(0, DEPARTURE.getTime() - now.getTime())
    const days = Math.floor(diff / 86400000)
    const hours = Math.floor((diff % 86400000) / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return { days, hours, minutes, seconds }
  }, [now])

  const journeyPct = useMemo(() => {
    if (now <= DEPARTURE) return 0
    if (now >= TRIP_END) return 100
    return Math.round(((now.getTime() - DEPARTURE.getTime()) / (TRIP_END.getTime() - DEPARTURE.getTime())) * 100)
  }, [now])

  const filteredMemories = useMemo(() => {
    if (activeFilter === 'all') return memories
    return memories.filter((item) => item.cat === activeFilter)
  }, [activeFilter])

  const packedCount = useMemo(() => Object.values(packingState).filter(Boolean).length, [packingState])
  const moodInfo = moodModes.find((mode) => mode.id === activeMood) || moodModes[0]

  const togglePacking = (index) => {
    setPackingState((current) => ({
      ...current,
      [index]: !current[index],
    }))
  }

  const handleMoonTap = () => {
    setMoonTaps((count) => {
      const next = count + 1
      if (next >= 4) {
        setMeteorShower(true)
        return 0
      }
      return next
    })
  }

  return (
    <div className={`app-shell mood-${activeMood}`}>
      <div className={`rain ${moodInfo.rain ? 'active' : ''}`} id="rain">
        {rainDrops.map((drop) => (
          <div key={drop.id} className="rain-drop" style={drop.style} />
        ))}
      </div>
      {meteorShower && (
        <div className="meteor-layer">
          {meteors.map((meteor) => (
            <div key={meteor.id} className="meteor" style={meteor.style} />
          ))}
        </div>
      )}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      <div className="mood-bar">
        {moodModes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            className={`mood-btn ${activeMood === mode.id ? 'active' : ''}`}
            title={mode.label}
            onClick={() => setActiveMood(mode.id)}
          >
            {mode.icon}
          </button>
        ))}
        <div className="vibe-name" id="vibe-name">
          {moodInfo.label.split(' ')[0]}
        </div>
      </div>

      <button
        type="button"
        className="music-btn"
        id="music-btn"
        title="Toggle ambient"
        onClick={() => setMusicOn((current) => !current)}
      >
        {musicOn ? '♬' : '♪'}
      </button>

      <nav>
        <div className="nav-logo">Kerala ✦ 2026</div>
        <div className="nav-links">
          <a href="#hero">Home</a>
          <a href="#timeline">Journey</a>
          <a href="#map">Route</a>
          <a href="#days">Days</a>
          <a href="#packing">Packing</a>
          <a href="#memories">Memories</a>
        </div>
      </nav>

      <div className="hero" id="hero">
        <div className="stars" id="stars" ref={starsRef}>
          {stars.map((star) => (
            <div key={star.id} className="star" style={star.style} />
          ))}
        </div>
        <button type="button" className="moon" id="moon" onClick={handleMoonTap} aria-label="Tap moon 4 times">
          <span className="sr-only">Tap moon 4 times for a surprise</span>
        </button>

        <div className="cloud" style={{ width: 180, height: 40, top: '18%', left: '-10%', '--cd': '35s' }} />
        <div className="cloud" style={{ width: 120, height: 28, top: '28%', left: '30%', '--cd': '50s', animationDelay: '-20s' }} />
        <div className="cloud" style={{ width: 150, height: 35, top: '22%', left: '60%', '--cd': '42s', animationDelay: '-10s' }} />
        <div className="mist-layer" />

        <div className="train-wrap">
          <div className="train">
            <div className="loco">
              <div className="smoke"><span /><span /><span /></div>
              <div className="wheels"><div className="wheel" /><div className="wheel" /></div>
            </div>
            <div className="car"><div className="wheels"><div className="wheel" /><div className="wheel" /></div></div>
            <div className="car"><div className="wheels"><div className="wheel" /><div className="wheel" /></div></div>
            <div className="car"><div className="wheels"><div className="wheel" /><div className="wheel" /></div></div>
          </div>
        </div>

        <div className="mountains">
          <div className="mtn-back" />
          <div className="mtn-front" />
        </div>

        <div className="hero-content">
          <div className="hero-label">{phaseCopy[phase].banner}</div>
          <h1 className="hero-title">
            <em>Your Dream Journey to</em>
            Kerala
          </h1>
          <p className="hero-sub">{phaseCopy[phase].label}</p>

          <div className="countdown">
            <div className="cd-unit"><span className="cd-num">{pad(countdown.days)}</span><span className="cd-label">Days</span></div>
            <span className="cd-sep">:</span>
            <div className="cd-unit"><span className="cd-num">{pad(countdown.hours)}</span><span className="cd-label">Hours</span></div>
            <span className="cd-sep">:</span>
            <div className="cd-unit"><span className="cd-num">{pad(countdown.minutes)}</span><span className="cd-label">Minutes</span></div>
            <span className="cd-sep">:</span>
            <div className="cd-unit"><span className="cd-num">{pad(countdown.seconds)}</span><span className="cd-label">Seconds</span></div>
          </div>
          <div className="hero-route">Vijayawada · Kochi · Munnar · Alleppey · Kochi</div>
        </div>

        <div className="scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-line" />
          <div className="moon-hint">Tap the moon 4 times ({moonTaps}/4)</div>
        </div>
      </div>

      <div className={`progress-banner ${phase === 'journey' ? 'show' : ''}`} id="progress-banner">
        <div className="pb-label">🚂 Journey in Progress — Currently Traveling</div>
        <div className="pb-bar-wrap"><div className="pb-bar" style={{ width: `${journeyPct}%` }} /></div>
        <div className="pb-pct">{journeyPct}% complete</div>
      </div>

      <div className="section-wrap">
        <section id="timeline">
          <div className="section-label">The Journey</div>
          <h2 className="section-title">Five Days of <em>Wonder</em></h2>
          <div className="divider" />
          <div className="timeline-wrap">
            <div className="tl-line" />
            {timelineStops.map((stop, index) => (
              <div key={stop.title} className={`tl-item ${index % 2 === 1 ? 'reverse' : ''}`}>
                <div className={`tl-card ${stop.ripple ? 'ripple-card' : ''}`}>
                  {stop.ripple && <div className="ripple-bg" />}
                  <div className="tl-date">{stop.date}</div>
                  <h3>{stop.title}</h3>
                  <p>{stop.text}</p>
                  <span className="tl-badge">{stop.badge}</span>
                </div>
                <div className="tl-dot">{stop.dot}</div>
                <div className="tl-spacer" />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="facts-strip">
        <div className="section-label">Did You Know</div>
        <h2 className="section-title">Kerala <em>Sparks</em></h2>
        <div className="facts-panel">
          <div className="fact-text" id="fact-text">{facts[factIndex]}</div>
          <button
            type="button"
            className="fact-btn"
            onClick={() => setFactIndex((idx) => (idx + 1) % facts.length)}
          >
            ✦ Discover Another Spark
          </button>
        </div>
      </div>

      <div className="map-section" id="map">
        <div className="section-label">The Route</div>
        <h2 className="section-title">Journey <em>Map</em></h2>
        <div className="divider map-divider" />
        <div className="map-container">
          <svg className="route-map" viewBox="0 0 700 440" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#e8c87a" strokeWidth="1.5" strokeLinecap="round" />
              </marker>
              <marker id="arrc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#00b89c" strokeWidth="1.5" strokeLinecap="round" />
              </marker>
              <marker id="arrb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M2 1L8 5L2 9" fill="none" stroke="#2e6ea6" strokeWidth="1.5" strokeLinecap="round" />
              </marker>
            </defs>
            <rect width="700" height="440" fill="#040e08" />
            <path d="M500 50 C520 80 530 130 525 175 C520 215 508 245 498 278 C488 308 482 330 488 358 C494 378 478 400 466 418" stroke="rgba(0,184,156,0.06)" strokeWidth="32" fill="none" strokeLinecap="round" />
            <path d="M130 110 C200 135 290 185 360 228" stroke="#e8c87a" strokeWidth="2" strokeDasharray="8,4" fill="none" markerEnd="url(#arrt)" />
            <path d="M360 228 C390 210 420 200 455 218" stroke="#00b89c" strokeWidth="2" strokeDasharray="8,4" fill="none" markerEnd="url(#arrc)" />
            <path d="M455 218 C468 248 472 278 468 310 C464 330 458 348 455 368" stroke="#2e6ea6" strokeWidth="2" strokeDasharray="5,3" fill="none" markerEnd="url(#arrb)" />
            <circle cx="130" cy="110" r="11" fill="#040e08" stroke="#e8c87a" strokeWidth="2" />
            <circle cx="130" cy="110" r="5" fill="#e8c87a" />
            <text x="130" y="93" fill="#e8c87a" fontFamily="Playfair Display,serif" fontSize="13" textAnchor="middle">Vijayawada</text>
            <text x="130" y="106" fill="rgba(245,240,232,0.3)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="middle">22 May · 4 AM</text>
            <circle cx="360" cy="228" r="11" fill="#040e08" stroke="#00b89c" strokeWidth="2" />
            <circle cx="360" cy="228" r="5" fill="#00b89c" />
            <text x="330" y="212" fill="#00b89c" fontFamily="Playfair Display,serif" fontSize="13" textAnchor="middle">Kochi</text>
            <text x="330" y="225" fill="rgba(245,240,232,0.3)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="middle">23 May · 2 AM</text>
            <circle cx="455" cy="218" r="11" fill="#040e08" stroke="#00b89c" strokeWidth="2" />
            <circle cx="455" cy="218" r="5" fill="#00b89c" />
            <text x="500" y="210" fill="#00b89c" fontFamily="Playfair Display,serif" fontSize="13" textAnchor="start">Munnar</text>
            <text x="500" y="223" fill="rgba(245,240,232,0.3)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="start">23–24 May</text>
            <circle cx="455" cy="368" r="11" fill="#040e08" stroke="#2e6ea6" strokeWidth="2" />
            <circle cx="455" cy="368" r="5" fill="#2e6ea6" />
            <text x="500" y="362" fill="#2e6ea6" fontFamily="Playfair Display,serif" fontSize="13" textAnchor="start">Alleppey</text>
            <text x="500" y="375" fill="rgba(245,240,232,0.3)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="start">25–26 May</text>
            <text x="240" y="185" fill="rgba(232,200,122,0.4)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="middle">~1050 km · 22 hrs</text>
            <text x="430" y="208" fill="rgba(0,184,156,0.5)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="middle">~130 km</text>
            <text x="492" y="295" fill="rgba(46,110,166,0.6)" fontFamily="DM Sans,sans-serif" fontSize="10" textAnchor="start">~85 km</text>
            <line x1="40" y1="408" x2="80" y2="408" stroke="#e8c87a" strokeWidth="2" strokeDasharray="6,3" />
            <text x="88" y="412" fill="rgba(245,240,232,0.45)" fontFamily="DM Sans,sans-serif" fontSize="11">Train</text>
            <line x1="140" y1="408" x2="180" y2="408" stroke="#00b89c" strokeWidth="2" strokeDasharray="6,3" />
            <text x="188" y="412" fill="rgba(245,240,232,0.45)" fontFamily="DM Sans,sans-serif" fontSize="11">Road</text>
            <line x1="240" y1="408" x2="280" y2="408" stroke="#2e6ea6" strokeWidth="2" strokeDasharray="4,3" />
            <text x="288" y="412" fill="rgba(245,240,232,0.45)" fontFamily="DM Sans,sans-serif" fontSize="11">Waterway</text>
          </svg>
        </div>
      </div>

      <div className="section-wrap" id="days">
        <section>
          <div className="section-label">Day by Day</div>
          <h2 className="section-title">The <em>Story</em> Unfolds</h2>
          <div className="divider" />
          <div className="days-grid">
            {dayCards.map((card, index) => (
              <div key={card.title} className="day-card" style={{ transitionDelay: `${index * 0.1}s` }}>
                <span className="day-icon">{card.icon}</span>
                <div className="day-num">{card.day}</div>
                <div className="day-title">{card.title}</div>
                <p className="day-text">{card.text}</p>
                <div className="day-tags">
                  {card.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="packing-section" id="packing">
        <div className="section-label">Be Prepared</div>
        <h2 className="section-title">Packing <em>Tracker</em></h2>
        <div className="divider pack-divider" />
        <div className="pack-progress"><div className="pack-bar" style={{ width: `${Math.round((packedCount / packingItems.length) * 100)}%` }} /></div>
        <div className="pack-percent">{packedCount} / {packingItems.length} packed</div>
        <div className="packing-grid">
          {packingItems.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`pack-item ${packingState[index] ? 'checked' : ''}`}
              onClick={() => togglePacking(index)}
            >
              <div className="pack-check">{packingState[index] ? '✓' : ''}</div>
              <div className="pack-label">{item}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="memories-section" id="memories">
        <div className="memories-inner">
          <div className="section-label">Curated Memories</div>
          <h2 className="section-title">Moments <em>Preserved</em></h2>
          <div className="divider" />
          <div className="mem-categories">
            {memoryFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`mem-cat ${activeFilter === filter.id ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="polaroid-grid">
            {filteredMemories.map((item) => (
              <div key={`${item.cat}-${item.caption}`} className="polaroid" style={{ '--rot': item.rot }}>
                <div className="polaroid-img">{item.emoji}</div>
                <div className="polaroid-caption">{item.caption}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="memories-upload-zone">
          <div className="section-label">Upload Memories</div>
          <h3 className="memories-title">Friends & memories shelves</h3>
          <p className="memories-sub">Add multiple photos per shelf. Scroll sideways to review each story.</p>
          <Gallery />
        </div>

        <CarouselSection />
      </div>

      <div className="closing">
        <p className="closing-quote">
          "The journey ends… but <em>memories stay forever.</em><br />Kerala will always call you back."
        </p>
        <div className="closing-line">✦ May 22 – 26, 2026 · Vijayawada to Kerala ✦</div>
        <div className="closing-stars">
          {['0s', '0.4s', '0.8s', '1.2s', '1.6s'].map((delay) => (
            <span key={delay} style={{ '--d': delay }}>✦</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
