import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Gallery from './components/Gallery'
import JourneyMap from './components/JourneyMap'
import CarouselSection from './components/CarouselSection'
import { PHOTO_FOLDER, SUPABASE_BUCKET, isSupabaseEnabled, supabase } from './lib/supabaseClient'
import './App.css'

const DEPARTURE = new Date('2026-05-22T03:50:00+05:30')
const ARRIVAL = new Date('2026-05-23T02:00:00+05:30')
const MEMORY_STORAGE_KEY = 'kerala-trip-memory-photos-v1'
const PACKING_STORAGE_KEY = 'kerala-trip-packing-v1'
const MOOD_STORAGE_KEY = 'kerala-trip-mood-v1'
const MAX_MEMORY_PHOTOS = 9
const MAX_UPLOAD_WIDTH = 1400

const moodModes = [
  { id: 'classic', label: 'Classic Night', icon: '🌌' },
  { id: 'sunrise', label: 'Sunrise Glow', icon: '🌅' },
  { id: 'monsoon', label: 'Monsoon Drift', icon: '🌧️' },
]

const navItems = [
  { id: 'countdown-section', label: 'Countdown' },
  { id: 'interactive-section', label: 'Interactive' },
  { id: 'timeline-section', label: 'Itinerary' },
  { id: 'days-section', label: 'Days' },
  { id: 'map-section', label: 'Map' },
  { id: 'memories-section', label: 'Memories' },
]

const keralaFacts = [
  'Kerala has one of India\'s highest literacy rates and an extraordinary reading culture.',
  'The famous backwaters are a network of canals, rivers, and lakes stretching over 900 km.',
  'Munnar\'s tea estates were developed over a century ago and remain among India\'s most scenic.',
  'Kerala cuisine uses coconut in many forms: milk, oil, grated, and roasted.',
  'Fort Kochi blends Portuguese, Dutch, and British colonial architecture in one walkable district.',
]

const packingChecklist = [
  { id: 'tickets', label: 'Train tickets and ID proofs' },
  { id: 'jacket', label: 'Light jacket for Munnar weather' },
  { id: 'charger', label: 'Phone charger and power bank' },
  { id: 'camera', label: 'Camera and extra memory card' },
  { id: 'meds', label: 'Basic medicines and motion sickness tabs' },
  { id: 'cash', label: 'Cash + cards for local markets' },
]

const timelineData = [
  {
    icon: '🚆',
    title: 'Night Train Journey',
    date: 'May 22, 2026 · 03:50 AM Departure',
    desc: "Board the overnight train as the city sleeps. Watch stars streak past your window as you leave home behind. The rhythmic clatter of the rails becomes your lullaby as you journey toward God's Own Country.",
    details: [
      'Departure: 03:50 AM',
      'Overnight sleeper train',
      'Arrival at Cochin: ~02:00 AM May 23',
      'Distance: ~500 km',
      'Pack: Snacks, music playlist, travel pillow',
    ],
  },
  {
    icon: '🌆',
    title: 'Cochin → Munnar',
    date: 'May 23 · Day 1',
    desc: 'Arrive at Cochin station as dawn breaks. Begin the breathtaking drive into the Western Ghats - switchback roads through rubber plantations, misty valleys, and the first glimpse of emerald tea gardens.',
    details: ['🌊 Cheeyappara Waterfalls', '🍵 Tea plantation walk', '⛰️ Arrive Munnar by evening', '🌡 Temperature: ~15-22°C', '📸 Golden hour photography'],
  },
  {
    icon: '⛰️',
    title: 'Munnar Sightseeing',
    date: 'May 24 · Day 2',
    desc: "A full immersion into Munnar's magic. The Tea Museum reveals the art of the leaf, Mattupetty Dam mirrors the mountains, Echo Point lets your voice touch the hills, and Eravikulam Park shows you the rare Nilgiri Tahr.",
    details: ['🏛 Tea Museum (opens 10 AM)', '💧 Mattupetty Dam', '🔊 Echo Point', '🦌 Eravikulam National Park', '🌿 Shopping: cardamom, tea'],
  },
  {
    icon: '🛶',
    title: 'Munnar → Alleppey',
    date: 'May 25 · Day 3',
    desc: "Descend from the mountains to the backwaters. Board a traditional kettuvallam houseboat - your floating palace for the night. Glide through narrow canals lined with palms, watch kingfishers dive, and dine on Kerala's finest seafood.",
    details: ['🚗 Munnar to Alleppey (4-5 hrs)', '⛵ Houseboat check-in: 12 PM', '🍽 Onboard Kerala cuisine', '🌅 Sunset on the backwaters', '🌙 Overnight stay on houseboat'],
  },
  {
    icon: '🌇',
    title: 'Alleppey → Cochin & Return',
    date: 'May 26 · Day 4',
    desc: "The final chapter. Fort Kochi's colonial lanes, the iconic Chinese fishing nets silhouetted against the Arabian Sea sunset, the aromatic lanes of the spice market, and the richly painted walls of Mattancherry Palace.",
    details: ['⚓ Fort Kochi heritage walk', '🎣 Chinese fishing nets', '🎨 Mattancherry Palace', '🌶 Jew Town spice market', '🚂 Evening return journey'],
  },
]

const memorySlots = [
  { icon: '🌄', label: 'Arrival Dawn' },
  { icon: '🍵', label: 'Tea Gardens' },
  { icon: '🌊', label: 'Waterfalls' },
  { icon: '🛶', label: 'Houseboat Life' },
  { icon: '🐘', label: 'Wildlife' },
  { icon: '🌅', label: 'Backwater Sunset' },
  { icon: '🍛', label: 'Kerala Feast' },
  { icon: '🎭', label: 'Culture' },
  { icon: '🌺', label: 'Tropical Flora' },
]

const dayCards = [
  {
    day: '01',
    emoji: '🌊🍵⛰️',
    date: 'May 23',
    title: 'Cochin to Munnar',
    desc: 'Arrive at Cochin and begin the scenic drive up to Munnar. Discover cascading waterfalls hidden in the mist, rolling tea plantations stretching to the horizon, and the fresh mountain air that fills your lungs.',
    tags: ['Waterfalls', 'Tea Plantations', 'Scenic Drive'],
    vars: {
      '--card-grad': 'linear-gradient(135deg,rgba(13,148,136,0.2),transparent)',
      '--card-glow': 'rgba(13,148,136,0.2)',
      '--card-border': 'rgba(13,148,136,0.3)',
    },
    tagBg: 'rgba(13,148,136,0.15)',
    tagColor: '#5eead4',
  },
  {
    day: '02',
    emoji: '🍃🏛️🦋',
    date: 'May 24',
    title: 'Munnar Sightseeing',
    desc: "A full day exploring Munnar's crown jewels - the enchanting Tea Museum, the serene Mattupetty Dam, the magical Echo Point, and wild encounters at Eravikulam National Park.",
    tags: ['Tea Museum', 'Echo Point', 'National Park'],
    vars: {
      '--card-grad': 'linear-gradient(135deg,rgba(21,128,61,0.2),transparent)',
      '--card-glow': 'rgba(21,128,61,0.2)',
      '--card-border': 'rgba(21,128,61,0.3)',
    },
    tagBg: 'rgba(21,128,61,0.15)',
    tagColor: '#86efac',
  },
  {
    day: '03',
    emoji: '🛶🌅🏡',
    date: 'May 25',
    title: 'Alleppey Backwaters',
    desc: "Board your private houseboat and drift through Alleppey's legendary backwaters. Watch the sun paint the lagoons gold, enjoy a traditional Kerala feast on deck, and sleep to the sound of gentle waters.",
    tags: ['Houseboat', 'Backwaters', 'Sunset Cruise'],
    vars: {
      '--card-grad': 'linear-gradient(135deg,rgba(3,105,161,0.2),transparent)',
      '--card-glow': 'rgba(3,105,161,0.2)',
      '--card-border': 'rgba(3,105,161,0.3)',
    },
    tagBg: 'rgba(3,105,161,0.15)',
    tagColor: '#7dd3fc',
  },
  {
    day: '04',
    emoji: '🌆🏰✨',
    date: 'May 26',
    title: 'Cochin & Return',
    desc: "The grand finale - explore Cochin's historic Fort Kochi, the iconic Chinese fishing nets at sunset, the vibrant spice markets, and Mattancherry's Dutch Palace before your journey home.",
    tags: ['Fort Kochi', 'Fishing Nets', 'Spice Markets'],
    vars: {
      '--card-grad': 'linear-gradient(135deg,rgba(217,119,6,0.2),transparent)',
      '--card-glow': 'rgba(217,119,6,0.2)',
      '--card-border': 'rgba(217,119,6,0.3)',
    },
    tagBg: 'rgba(217,119,6,0.15)',
    tagColor: '#fcd34d',
  },
]

function pad(n) {
  return String(Math.floor(n)).padStart(2, '0')
}

function buildStars() {
  return Array.from({ length: 200 }, (_, idx) => {
    const size = Math.random() * 2.5 + 0.5
    return {
      id: idx,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        '--dur': `${(Math.random() * 4 + 2).toFixed(1)}s`,
        '--delay': `${(Math.random() * 5).toFixed(1)}s`,
        '--min-op': (Math.random() * 0.3 + 0.1).toFixed(2),
      },
    }
  })
}

function buildParticles() {
  const colors = ['rgba(212,168,83,0.4)', 'rgba(13,148,136,0.3)', 'rgba(255,255,255,0.15)']
  return Array.from({ length: 15 }, (_, idx) => {
    const size = Math.random() * 4 + 2
    return {
      id: idx,
      style: {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}vw`,
        background: colors[Math.floor(Math.random() * colors.length)],
        '--fdur': `${(Math.random() * 20 + 15).toFixed(0)}s`,
        '--fdelay': `${(Math.random() * 15).toFixed(0)}s`,
      },
    }
  })
}

function buildRainDrops() {
  return Array.from({ length: 60 }, (_, idx) => ({
    id: idx,
    style: {
      left: `${Math.random() * 100}%`,
      animationDelay: `${(Math.random() * 1.5).toFixed(2)}s`,
      animationDuration: `${(Math.random() * 0.9 + 0.9).toFixed(2)}s`,
      opacity: Math.random() * 0.5 + 0.2,
    },
  }))
}

function buildMeteors() {
  return Array.from({ length: 10 }, (_, idx) => ({
    id: idx,
    style: {
      top: `${Math.random() * 55 + 8}%`,
      left: `${Math.random() * 70}%`,
      animationDelay: `${(Math.random() * 1.8).toFixed(2)}s`,
    },
  }))
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

async function toCompressedDataUrl(file) {
  const sourceDataUrl = await readFileAsDataUrl(file)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_UPLOAD_WIDTH / img.width)
      const width = Math.max(1, Math.floor(img.width * scale))
      const height = Math.max(1, Math.floor(img.height * scale))

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        resolve(sourceDataUrl)
        return
      }

      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }

    img.onerror = () => resolve(sourceDataUrl)
    img.src = sourceDataUrl
  })
}

function dataUrlToBlob(dataUrl) {
  const [meta, b64] = dataUrl.split(',')
  const mime = meta.match(/data:(.*?);base64/)?.[1] || 'image/jpeg'
  const binary = atob(b64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i)
  }
  return new Blob([array], { type: mime })
}

function toSafeFileStem(name) {
  const base = name.replace(/\.[^.]+$/, '')
  return base.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'photo'
}

function buildRemotePath(file, idx) {
  const stamp = Date.now()
  return `${PHOTO_FOLDER}/${stamp}-${idx}-${toSafeFileStem(file.name)}.jpg`
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [activeStop, setActiveStop] = useState(0)
  const [navSolid, setNavSolid] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState(() => {
    if (isSupabaseEnabled) return []
    if (typeof window === 'undefined') return []

    try {
      const stored = window.localStorage.getItem(MEMORY_STORAGE_KEY)
      if (!stored) return []

      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []

      return parsed
        .filter((item) => item && typeof item.url === 'string' && item.url.startsWith('data:image/'))
        .slice(0, MAX_MEMORY_PHOTOS)
    } catch {
      return []
    }
  })
  const [mood, setMood] = useState(() => {
    if (typeof window === 'undefined') return 'classic'
    const storedMood = window.localStorage.getItem(MOOD_STORAGE_KEY)
    return moodModes.some((mode) => mode.id === storedMood) ? storedMood : 'classic'
  })
  const [packedItems, setPackedItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = window.localStorage.getItem(PACKING_STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : []
      if (!Array.isArray(parsed)) return []
      return parsed.filter((itemId) => packingChecklist.some((item) => item.id === itemId))
    } catch {
      return []
    }
  })
  const [activeFact, setActiveFact] = useState(0)
  const [moonTapCount, setMoonTapCount] = useState(0)
  const [meteorShower, setMeteorShower] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [syncMessage, setSyncMessage] = useState(
    isSupabaseEnabled
      ? 'Cloud sync is enabled. Photos are shared across devices.'
      : 'Cloud sync is disabled. Photos are saved only on this browser.',
  )
  const fileInputRef = useRef(null)
  const touchStartXRef = useRef(null)

  const stars = useMemo(() => buildStars(), [])
  const particles = useMemo(() => buildParticles(), [])
  const rainDrops = useMemo(() => buildRainDrops(), [])
  const meteors = useMemo(() => buildMeteors(), [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            const children = entry.target.querySelectorAll('.day-card,.glass-card,.memory-slot')
            children.forEach((child, idx) => {
              child.style.transitionDelay = `${idx * 0.1}s`
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isSupabaseEnabled) return
    try {
      window.localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(uploadedPhotos))
    } catch {
      // Ignore storage quota errors and keep in-memory state.
    }
  }, [uploadedPhotos])

  useEffect(() => {
    if (!isSupabaseEnabled || !supabase) return

    const loadCloudPhotos = async () => {
      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .list(PHOTO_FOLDER, {
          limit: MAX_MEMORY_PHOTOS,
          offset: 0,
          sortBy: { column: 'name', order: 'desc' },
        })

      if (error) {
        setSyncMessage('Cloud sync configured, but loading failed. Check bucket and policies.')
        return
      }

      const mapped = (data || [])
        .filter((item) => item.name)
        .slice(0, MAX_MEMORY_PHOTOS)
        .map((item, idx) => {
          const fullPath = `${PHOTO_FOLDER}/${item.name}`
          const { data: publicData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fullPath)
          return {
            id: `${item.id || item.name}-${idx}`,
            name: item.name,
            url: publicData.publicUrl,
            path: fullPath,
          }
        })

      setUploadedPhotos(mapped)
      setSyncMessage('Cloud sync is enabled. Photos are shared across devices.')
    }

    loadCloudPhotos()
  }, [])

  useEffect(() => {
    window.localStorage.setItem(MOOD_STORAGE_KEY, mood)
  }, [mood])

  useEffect(() => {
    window.localStorage.setItem(PACKING_STORAGE_KEY, JSON.stringify(packedItems))
  }, [packedItems])

  useEffect(() => {
    if (!meteorShower) return
    const timer = setTimeout(() => setMeteorShower(false), 4500)
    return () => clearTimeout(timer)
  }, [meteorShower])

  useEffect(() => {
    const hasLightbox = lightboxIndex !== null
    const hasMenu = mobileMenuOpen
    document.body.style.overflow = hasLightbox || hasMenu ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, mobileMenuOpen])

  useEffect(() => {
    const handleKeys = (event) => {
      if (event.key === 'Escape') {
        if (lightboxIndex !== null) setLightboxIndex(null)
        if (mobileMenuOpen) setMobileMenuOpen(false)
      }
      if (lightboxIndex !== null && event.key === 'ArrowRight') {
        setLightboxIndex((current) => {
          if (current === null) return current
          return (current + 1) % uploadedPhotos.length
        })
      }
      if (lightboxIndex !== null && event.key === 'ArrowLeft') {
        setLightboxIndex((current) => {
          if (current === null) return current
          return (current - 1 + uploadedPhotos.length) % uploadedPhotos.length
        })
      }
    }

    window.addEventListener('keydown', handleKeys)
    return () => window.removeEventListener('keydown', handleKeys)
  }, [lightboxIndex, mobileMenuOpen, uploadedPhotos.length])

  const phase = useMemo(() => {
    if (now < DEPARTURE) return 'before'
    if (now >= DEPARTURE && now < ARRIVAL) return 'journey'
    return 'arrived'
  }, [now])

  const diff = DEPARTURE - now
  const journeyDiff = ARRIVAL - now
  const journeyTotal = ARRIVAL - DEPARTURE
  const journeyElapsed = now - DEPARTURE

  const countdown = useMemo(() => {
    if (phase === 'before') {
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      }
    }

    if (phase === 'journey') {
      return {
        days: 0,
        hours: Math.floor(journeyDiff / 3600000),
        mins: Math.floor((journeyDiff % 3600000) / 60000),
        secs: Math.floor((journeyDiff % 60000) / 1000),
      }
    }

    return { days: 0, hours: 0, mins: 0, secs: 0 }
  }, [phase, diff, journeyDiff])

  const journeyPct = useMemo(() => {
    if (phase === 'arrived') return 100
    if (phase !== 'journey') return 0
    return Math.min(100, Math.max(0, (journeyElapsed / journeyTotal) * 100))
  }, [phase, journeyElapsed, journeyTotal])

  const etaText = useMemo(() => {
    if (phase === 'before') return 'Trip has not started yet'
    if (phase === 'arrived') return 'You have arrived in Kerala'
    return `ETA: ${pad(Math.floor(journeyDiff / 3600000))}h ${pad(Math.floor((journeyDiff % 3600000) / 60000))}m ${pad(Math.floor((journeyDiff % 60000) / 1000))}s remaining`
  }, [phase, journeyDiff])

  const phaseBadge = phase === 'before' ? '🌙 Pre-departure' : phase === 'journey' ? '🚆 On the Journey!' : '🌴 Arrived in Kerala!'
  const phaseSubtitle = phase === 'before' ? 'Begins In...' : phase === 'journey' ? 'Until You Arrive...' : "Welcome to God's Own Country"

  const handleUpload = async (event) => {
    const input = event.target
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    setIsUploading(true)

    try {
      if (isSupabaseEnabled && supabase) {
        const selected = files.slice(0, MAX_MEMORY_PHOTOS)
        for (let idx = 0; idx < selected.length; idx += 1) {
          const file = selected[idx]
          const compressedUrl = await toCompressedDataUrl(file)
          const blob = dataUrlToBlob(compressedUrl)
          const remotePath = buildRemotePath(file, idx)

          const { error } = await supabase.storage.from(SUPABASE_BUCKET).upload(remotePath, blob, {
            contentType: 'image/jpeg',
            upsert: false,
          })

          if (error) {
            setSyncMessage('Upload failed for one or more images. Check bucket permissions.')
            continue
          }
        }

        const { data, error } = await supabase.storage
          .from(SUPABASE_BUCKET)
          .list(PHOTO_FOLDER, {
            limit: MAX_MEMORY_PHOTOS,
            offset: 0,
            sortBy: { column: 'name', order: 'desc' },
          })

        if (!error) {
          const mapped = (data || [])
            .filter((item) => item.name)
            .slice(0, MAX_MEMORY_PHOTOS)
            .map((item, idx) => {
              const fullPath = `${PHOTO_FOLDER}/${item.name}`
              const { data: publicData } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(fullPath)
              return {
                id: `${item.id || item.name}-${idx}`,
                name: item.name,
                url: publicData.publicUrl,
                path: fullPath,
              }
            })
          setUploadedPhotos(mapped)
        }
      } else {
        const mapped = await Promise.all(
          files.map(async (file, idx) => {
            const compressedUrl = await toCompressedDataUrl(file)
            return {
              id: `${file.name}-${file.lastModified}-${Date.now()}-${idx}`,
              name: file.name,
              url: compressedUrl,
            }
          }),
        )

        setUploadedPhotos((prev) => {
          return [...prev, ...mapped].slice(0, memorySlots.length)
        })
      }
    } finally {
      setIsUploading(false)
      input.value = ''
    }
  }

  const clearUploads = () => {
    const clear = async () => {
      if (isSupabaseEnabled && supabase) {
        const { data } = await supabase.storage.from(SUPABASE_BUCKET).list(PHOTO_FOLDER, { limit: 100 })
        const targets = (data || []).filter((item) => item.name).map((item) => `${PHOTO_FOLDER}/${item.name}`)
        if (targets.length) {
          await supabase.storage.from(SUPABASE_BUCKET).remove(targets)
        }
      } else {
        window.localStorage.removeItem(MEMORY_STORAGE_KEY)
      }

      setUploadedPhotos([])
      setLightboxIndex(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    clear()
  }

  const bannerVisible = phase === 'journey'
  const packingPct = Math.round((packedItems.length / packingChecklist.length) * 100)

  const handleMoonClick = () => {
    setMoonTapCount((count) => {
      const next = count + 1
      if (next >= 4) {
        setMeteorShower(true)
        return 0
      }
      return next
    })
  }

  const handleMoonKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleMoonClick()
    }
  }

  const showNextFact = () => {
    if (keralaFacts.length < 2) return
    setActiveFact((current) => {
      let next = current
      while (next === current) {
        next = Math.floor(Math.random() * keralaFacts.length)
      }
      return next
    })
  }

  const togglePacking = (itemId) => {
    setPackedItems((current) =>
      current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    )
  }

  const openLightbox = (idx) => {
    setLightboxIndex(idx)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const stepLightbox = (direction) => {
    if (!uploadedPhotos.length) return
    setLightboxIndex((current) => {
      if (current === null) return current
      return (current + direction + uploadedPhotos.length) % uploadedPhotos.length
    })
  }

  const handleLightboxTouchStart = (event) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
  }

  const handleLightboxTouchEnd = (event) => {
    if (uploadedPhotos.length < 2 || touchStartXRef.current === null) return

    const endX = event.changedTouches[0]?.clientX
    if (typeof endX !== 'number') return

    const deltaX = endX - touchStartXRef.current
    const swipeThreshold = 40

    if (Math.abs(deltaX) < swipeThreshold) return

    if (deltaX < 0) {
      stepLightbox(1)
    } else {
      stepLightbox(-1)
    }

    touchStartXRef.current = null
  }

  const activeLightboxPhoto = lightboxIndex !== null ? uploadedPhotos[lightboxIndex] : null
  const cloudStatus = syncMessage.includes('loading failed') || syncMessage.includes('Upload failed')
    ? 'error'
    : isSupabaseEnabled
      ? 'cloud'
      : 'local'
  const cloudStatusLabel = cloudStatus === 'cloud'
    ? 'Cloud Sync'
    : cloudStatus === 'error'
      ? 'Cloud Issue'
      : 'Local Only'

  return (
    <div className={`app-root mood-${mood} ${phase === 'journey' ? 'journey-mode' : ''} ${phase === 'arrived' ? 'arrived-mode' : ''}`}>
      <nav id="main-nav" style={{ background: navSolid ? 'rgba(10,15,30,0.95)' : 'rgba(10,15,30,0.7)' }}>
        <div className="nav-logo">✦ Journey to Kerala</div>
        <div className="nav-links">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {item.label}
            </a>
          ))}
        </div>
        <button
          type="button"
          className="mobile-nav-toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {mobileMenuOpen && <button type="button" className="mobile-menu-backdrop" aria-label="Close menu backdrop" onClick={() => setMobileMenuOpen(false)} />}

      <aside className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-head">
          <span>Navigate</span>
          <button type="button" aria-label="Close mobile menu" onClick={() => setMobileMenuOpen(false)}>
            ✕
          </button>
        </div>
        <div className="mobile-menu-links">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </aside>

      <div id="journey-banner" style={{ display: bannerVisible ? 'block' : 'none' }}>
        🚆 CURRENTLY EN ROUTE TO KERALA · The adventure has begun · 🌴
      </div>

      <div className="stars-layer" id="stars">
        {stars.map((star) => (
          <div key={star.id} className="star" style={star.style} />
        ))}
      </div>

      <div id="particles">
        {particles.map((particle) => (
          <div key={particle.id} className="particle" style={particle.style} />
        ))}
      </div>

      <div className={`rain-layer ${mood === 'monsoon' ? 'active' : ''}`}>
        {rainDrops.map((drop) => (
          <span key={drop.id} className="rain-drop" style={drop.style} />
        ))}
      </div>

      {meteorShower && (
        <div className="meteor-layer">
          {meteors.map((meteor) => (
            <span key={meteor.id} className="meteor" style={meteor.style} />
          ))}
        </div>
      )}

      <section className="hero" id="hero-section">
        <div className="moon" role="button" tabIndex={0} onClick={handleMoonClick} onKeyDown={handleMoonKey} aria-label="Tap moon for surprise" />

        <div style={{ position: 'absolute', top: 120, left: '5%', width: 120, height: 30, background: 'rgba(255,255,255,0.04)', borderRadius: 50, filter: 'blur(8px)', animation: 'cloudDrift 25s linear infinite' }} />
        <div style={{ position: 'absolute', top: 160, left: '30%', width: 180, height: 35, background: 'rgba(255,255,255,0.03)', borderRadius: 50, filter: 'blur(8px)', animation: 'cloudDrift 35s linear infinite', animationDelay: '-10s' }} />
        <div style={{ position: 'absolute', top: 100, right: '20%', width: 140, height: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 50, filter: 'blur(8px)', animation: 'cloudDrift 30s linear infinite', animationDelay: '-15s' }} />

        <div
          id="hero-content"
          style={{ position: 'relative', zIndex: 5, textAlign: 'center', padding: '0 20px', maxWidth: 900, margin: '0 auto' }}
        >
          <div className="badge" style={{ marginBottom: 24 }} id="phase-badge">
            {phaseBadge}
          </div>

          <h1
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1rem,3vw,1.2rem)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              color: '#94a3b8',
              marginBottom: 12,
            }}
          >
            Your Dream Journey
          </h1>
          <h2
            className="glow-text"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(3rem,8vw,6.5rem)',
              fontWeight: 900,
              lineHeight: 0.95,
              color: '#f8fafc',
              marginBottom: 8,
            }}
          >
            Kerala
          </h2>
          <h3
            id="hero-sub"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: 'clamp(1rem,2.5vw,1.5rem)',
              fontStyle: 'italic',
              color: 'var(--gold)',
              marginBottom: 40,
            }}
          >
            {phaseSubtitle}
          </h3>

          <div
            id="countdown-display"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 48,
            }}
          >
            <div className="countdown-box" id="countdown-section">
              <div className="countdown-num" id="cd-days">
                {pad(countdown.days)}
              </div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="colon">:</div>
            <div className="countdown-box">
              <div className="countdown-num" id="cd-hours">
                {pad(countdown.hours)}
              </div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="colon">:</div>
            <div className="countdown-box">
              <div className="countdown-num" id="cd-mins">
                {pad(countdown.mins)}
              </div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="colon">:</div>
            <div className="countdown-box">
              <div className="countdown-num" id="cd-secs">
                {pad(countdown.secs)}
              </div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
              fontSize: '0.85rem',
              color: '#64748b',
              letterSpacing: '0.06em',
              marginBottom: 48,
            }}
          >
            <span>🛫 May 22, 2026 · 03:50 AM</span>
            <span style={{ color: 'rgba(212,168,83,0.3)' }}>----------</span>
            <span>🌴 May 23, 2026 · 02:00 AM</span>
          </div>

          <div
            className="scroll-hint"
            style={{ color: '#475569', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            ↓ Explore Your Journey
          </div>
          <div style={{ marginTop: 10, color: 'rgba(148,163,184,0.7)', fontSize: '0.72rem', letterSpacing: '0.08em' }}>
            Tap the moon 4 times for a sky surprise ({moonTapCount}/4)
          </div>
        </div>

        <div className="mountains">
          <svg viewBox="0 0 1440 200" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 200 }}>
            <polygon points="0,200 200,40 400,200" fill="#0d1a14" opacity="0.9" />
            <polygon points="150,200 380,20 600,200" fill="#0a150f" opacity="0.95" />
            <polygon points="400,200 620,60 850,200" fill="#091410" opacity="0.9" />
            <polygon points="600,200 850,10 1100,200" fill="#0d1a14" opacity="0.95" />
            <polygon points="900,200 1100,45 1320,200" fill="#0a150f" />
            <polygon points="1100,200 1300,30 1440,120 1440,200" fill="#091410" />
            <rect x="60" y="160" width="6" height="40" fill="#061008" />
            <polygon points="63,125 50,165 76,165" fill="#061008" />
            <rect x="1350" y="155" width="6" height="45" fill="#061008" />
            <polygon points="1353,120 1340,158 1366,158" fill="#061008" />
            <rect x="1370" y="160" width="5" height="40" fill="#061008" />
            <polygon points="1373,130 1362,163 1384,163" fill="#061008" />
          </svg>
        </div>

        <div className="track-container" style={{ zIndex: 3 }}>
          <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.12)' }} />
          <div className="track-line" />
          <div className="train" id="hero-train">
            🚂
          </div>
        </div>
      </section>

      <section
        id="journey-progress-section"
        style={{ display: phase === 'journey' || phase === 'arrived' ? 'block' : 'none', padding: '40px 20px', background: 'linear-gradient(180deg,#061a0f,#0a0f1e)' }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="badge" style={{ marginBottom: 20 }}>
            🚆 Live Journey
          </div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Currently <span>Traveling</span>
          </h2>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.9rem' }}>
            Your train is on its way to God's Own Country
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>🏠 Departure</span>
            <span id="progress-pct">{journeyPct.toFixed(0)}%</span>
            <span>🌴 Kerala</span>
          </div>
          <div className="progress-track" style={{ marginBottom: 24 }}>
            <div className="progress-fill" id="progress-fill" style={{ width: `${journeyPct.toFixed(1)}%` }}>
              <div className="progress-glow" />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569' }}>
            <span>May 22, 03:50 AM</span>
            <span>May 23, 02:00 AM</span>
          </div>

          <div
            id="eta-display"
            style={{
              marginTop: 20,
              textAlign: 'center',
              padding: 16,
              background: 'rgba(13,148,136,0.1)',
              border: '1px solid rgba(13,148,136,0.2)',
              borderRadius: 16,
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.9rem',
              color: '#5eead4',
            }}
          >
            ⏱ {etaText}
          </div>
        </div>
      </section>

      <section id="interactive-section" style={{ padding: '40px 20px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 34 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              ✨ Interactive Hub
            </div>
            <h2 className="section-title">
              Customize Your <span>Journey Vibe</span>
            </h2>
          </div>

          <div className="interactive-grid reveal">
            <article className="hub-card">
              <h3 className="hub-title">Scene Mood</h3>
              <p className="hub-copy">Switch the visual atmosphere of your Kerala journey page.</p>
              <div className="mood-wrap">
                {moodModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    className={`mood-chip ${mood === mode.id ? 'active' : ''}`}
                    onClick={() => setMood(mode.id)}
                  >
                    <span>{mode.icon}</span>
                    {mode.label}
                  </button>
                ))}
              </div>
            </article>

            <article className="hub-card">
              <h3 className="hub-title">Kerala Spark Fact</h3>
              <p className="hub-copy">Hit shuffle for a fresh travel nugget.</p>
              <div className="fact-orb">💡</div>
              <p className="fact-text">{keralaFacts[activeFact]}</p>
              <button type="button" className="hub-action" onClick={showNextFact}>
                Shuffle Fact
              </button>
            </article>

            <article className="hub-card">
              <h3 className="hub-title">Packing Tracker</h3>
              <p className="hub-copy">Checklist is saved in your browser for this trip site.</p>
              <div className="packing-progress-track">
                <div className="packing-progress-fill" style={{ width: `${packingPct}%` }} />
              </div>
              <div className="packing-progress-label">{packingPct}% ready</div>
              <div className="packing-list">
                {packingChecklist.map((item) => {
                  const checked = packedItems.includes(item.id)
                  return (
                    <label key={item.id} className={`packing-item ${checked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePacking(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  )
                })}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="timeline-section" style={{ padding: '80px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              🗺️ Itinerary
            </div>
            <h2 className="section-title">
              Your <span>Journey</span> Unfolds
            </h2>
            <p style={{ color: '#64748b', marginTop: 12, fontSize: '0.95rem' }}>
              Tap a stop to explore what awaits
            </p>
          </div>

          <div className="reveal timeline-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, padding: '20px 10px', minWidth: 900 }}>
              {timelineData.map((item, idx) => (
                <Fragment key={`timeline-${item.title}`}>
                  <button
                    key={`stop-${item.title}`}
                    type="button"
                    className={`timeline-card ${activeStop === idx ? 'active' : ''}`}
                    onClick={() => setActiveStop(idx)}
                    id={`stop-${idx}`}
                    style={{ background: 'transparent', border: 'none', color: 'inherit', textAlign: 'left' }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          background:
                            idx === 0
                              ? 'linear-gradient(135deg,#1e40af,#3b82f6)'
                              : idx === 1
                                ? 'linear-gradient(135deg,#0d9488,#14b8a6)'
                                : idx === 2
                                  ? 'linear-gradient(135deg,#15803d,#22c55e)'
                                  : idx === 3
                                    ? 'linear-gradient(135deg,#0369a1,#0ea5e9)'
                                    : 'linear-gradient(135deg,#d97706,#f59e0b)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                          margin: '0 auto 8px',
                        }}
                      >
                        {item.icon}
                      </div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>
                        {idx === 0 ? 'Night Train' : `Day ${idx}`}
                      </div>
                    </div>
                    <div className="card-inner">
                      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                        {idx === 0 ? 'Train Journey' : item.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{idx === 0 ? 'May 22 · 03:50 AM' : item.date.replace(' · Day', '')}</div>
                    </div>
                  </button>
                  {idx < timelineData.length - 1 && <div className="timeline-connector" key={`connector-${item.title}`} />}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="reveal" style={{ marginTop: 24 }}>
            <div id="timeline-expanded" className="expanded-panel open glass-card" style={{ padding: 28, borderColor: 'rgba(212,168,83,0.2)' }}>
              <div id="expanded-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '2.5rem' }}>{timelineData[activeStop].icon}</div>
                  <div>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
                      {timelineData[activeStop].title}
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{timelineData[activeStop].date}</div>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '0.92rem', marginBottom: 20 }}>
                  {timelineData[activeStop].desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {timelineData[activeStop].details.map((det) => (
                    <span
                      key={det}
                      style={{
                        fontSize: '0.8rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 14px',
                        borderRadius: 99,
                        color: '#cbd5e1',
                      }}
                    >
                      {det}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="days-section" style={{ padding: '60px 20px 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              📅 Day by Day
            </div>
            <h2 className="section-title">
              The <span>Story</span> of Your Trip
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 24 }} className="reveal">
            {dayCards.map((card) => (
              <div key={card.day} className="day-card" style={{ ...card.vars, padding: '32px 28px' }}>
                <div className="day-num">{card.day}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.2rem', marginBottom: 12 }}>{card.emoji}</div>
                  <div className="badge" style={{ marginBottom: 12 }}>
                    {card.date}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      marginBottom: 10,
                      lineHeight: 1.2,
                    }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.7 }}>{card.desc}</p>
                  <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{ fontSize: '0.72rem', background: card.tagBg, padding: '4px 10px', borderRadius: 99, color: card.tagColor }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="map-section" style={{ padding: '60px 20px 80px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              📍 Route Map
            </div>
            <h2 className="section-title">
              The <span>Path</span> Through Paradise
            </h2>
          </div>
        </div>
        <div className="reveal">
          <JourneyMap progress={journeyPct} />
        </div>
      </section>

      <section id="memories-section" style={{ padding: '60px 20px 100px', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge" style={{ marginBottom: 16 }}>
              📸 Memories
            </div>
            <h2 className="section-title">
              Where <span>Moments</span> Will Live
            </h2>
            <p style={{ color: '#64748b', marginTop: 12, fontSize: '0.95rem' }}>
              Your photos and videos will fill these frames after the journey
            </p>
          </div>

          <div className="upload-strip reveal" style={{ display: 'none' }} aria-hidden="true">
            <p>
              Add your own trip pictures here. You can upload up to 9 photos, and they will appear in the memory slots below.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className={`sync-indicator ${cloudStatus}`} title={syncMessage} aria-label={syncMessage}>
                <span className="sync-dot" />
                {cloudStatusLabel}
              </span>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} disabled={isUploading} />
              <button type="button" onClick={clearUploads} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Clear Photos'}
              </button>
            </div>
          </div>

          <div className="reveal memory-grid" style={{ display: 'none', marginTop: 18 }} aria-hidden="true">
            {memorySlots.map((slot, idx) => {
              const photo = uploadedPhotos[idx]
              return (
                <div key={slot.label} className="memory-slot">
                  {photo ? (
                    <>
                      <button
                        type="button"
                        className="memory-photo-button"
                        onClick={() => openLightbox(idx)}
                        aria-label={`Open ${slot.label} photo`}
                      >
                        <img src={photo.url} alt={photo.name} />
                      </button>
                      <span className="memory-slot-label">{slot.label}</span>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem' }}>{slot.icon}</div>
                      <span>{slot.label}</span>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="reveal" style={{ marginTop: 28 }}>
            <Gallery />
          </div>

          <div className="reveal" style={{ marginTop: 26 }}>
            <CarouselSection />
          </div>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.5rem',
            fontStyle: 'italic',
            color: 'var(--gold)',
            marginBottom: 8,
            textShadow: '0 0 20px rgba(212,168,83,0.3)',
          }}
        >
          Journey to Kerala
        </div>
        <div style={{ fontSize: '0.8rem', color: '#475569', letterSpacing: '0.1em' }}>
          May 22 - 26, 2026 · God's Own Country 🌴
        </div>
      </footer>

      {activeLightboxPhoto && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo preview">
          <button type="button" className="lightbox-backdrop" aria-label="Close photo preview" onClick={closeLightbox} />
          <div className="lightbox-content">
            <button type="button" className="lightbox-close" aria-label="Close" onClick={closeLightbox}>
              ✕
            </button>
            {uploadedPhotos.length > 1 && (
              <button type="button" className="lightbox-arrow left" aria-label="Previous photo" onClick={() => stepLightbox(-1)}>
                ‹
              </button>
            )}
            <img
              src={activeLightboxPhoto.url}
              alt={activeLightboxPhoto.name}
              className="lightbox-image"
              onTouchStart={handleLightboxTouchStart}
              onTouchEnd={handleLightboxTouchEnd}
            />
            {uploadedPhotos.length > 1 && (
              <button type="button" className="lightbox-arrow right" aria-label="Next photo" onClick={() => stepLightbox(1)}>
                ›
              </button>
            )}
            <div className="lightbox-caption">
              {activeLightboxPhoto.name} · {lightboxIndex + 1}/{uploadedPhotos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
