import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'kerala-memories-carousel-v2'
const DESKTOP_OFFSETS = [-2, -1, 0, 1, 2]

function wrapIndex(index, total) {
  if (!total) return 0
  return ((index % total) + total) % total
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

function cardStyle(offset) {
  if (offset === 0) {
    return {
      transform: 'translate(-50%, -50%) translateX(0px) translateY(0px) scale(1) rotateY(0deg)',
      opacity: 1,
      zIndex: 8,
    }
  }

  if (offset === -1) {
    return {
      transform: 'translate(-50%, -50%) translateX(-260px) translateY(44px) scale(0.84) rotateY(18deg)',
      opacity: 0.86,
      zIndex: 6,
    }
  }

  if (offset === 1) {
    return {
      transform: 'translate(-50%, -50%) translateX(260px) translateY(44px) scale(0.84) rotateY(-18deg)',
      opacity: 0.86,
      zIndex: 6,
    }
  }

  if (offset === -2) {
    return {
      transform: 'translate(-50%, -50%) translateX(-440px) translateY(110px) scale(0.65) rotateY(26deg)',
      opacity: 0.42,
      zIndex: 4,
    }
  }

  return {
    transform: 'translate(-50%, -50%) translateX(440px) translateY(110px) scale(0.65) rotateY(-26deg)',
    opacity: 0.42,
    zIndex: 4,
  }
}

function CarouselSection() {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed.filter((it) => it?.image) : []
    } catch {
      return []
    }
  })
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const slides = useMemo(() => items.filter((item) => item?.image), [items])

  const goNext = () => {
    if (!slides.length) return
    setActive((index) => wrapIndex(index + 1, slides.length))
  }

  const goPrev = () => {
    if (!slides.length) return
    setActive((index) => wrapIndex(index - 1, slides.length))
  }

  useEffect(() => {
    if (slides.length < 2) return undefined
    const timer = window.setInterval(() => {
      setActive((index) => wrapIndex(index + 1, slides.length))
    }, 3600)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event) => {
    const start = touchStartX.current
    if (start === null) return

    const end = event.changedTouches[0]?.clientX
    if (typeof end !== 'number') return

    const delta = end - start
    if (Math.abs(delta) > 35) {
      if (delta < 0) goNext()
      if (delta > 0) goPrev()
    }

    touchStartX.current = null
  }

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const mapped = await Promise.all(
      files.map(async (file, index) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${index}`,
        image: await readFileAsDataUrl(file),
      })),
    )

    setItems((current) => [...current, ...mapped])
    event.target.value = ''
  }

  const clearAll = () => {
    setItems([])
    setActive(0)
  }

  return (
    <section className="memories-carousel-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="memories-carousel-bg" aria-hidden="true">
        <span>MEMORIES</span>
      </div>

      <header className="memories-carousel-head">
        <div className="badge">🎠 Memory Reel</div>
        <div className="memories-carousel-controls">
          <label className="memories-btn primary" htmlFor="memories-carousel-upload">Add Photos</label>
          <input id="memories-carousel-upload" type="file" accept="image/*" multiple onChange={handleUpload} />
          <button type="button" className="memories-btn" onClick={clearAll}>Clear</button>
        </div>
      </header>

      <div className="memories-carousel-desktop">
        {slides.length > 0 ? (
          <>
            <button type="button" className="memories-arrow left" onClick={goPrev} aria-label="Previous image">‹</button>
            <div className="memories-stage">
              {DESKTOP_OFFSETS.map((offset) => {
                const index = wrapIndex(active + offset, slides.length)
                const item = slides[index]
                return (
                  <article key={`${item.id}-${offset}`} className="memories-card" style={cardStyle(offset)}>
                    <div className="memories-card-media">
                      <img src={item.image} alt="" className="memories-card-bg" aria-hidden="true" loading="lazy" />
                      <img src={item.image} alt="Trip memory" className="memories-card-image" loading="lazy" />
                    </div>
                  </article>
                )
              })}
            </div>
            <button type="button" className="memories-arrow right" onClick={goNext} aria-label="Next image">›</button>
          </>
        ) : (
          <div className="memories-empty">Upload photos to generate your full-screen memory carousel.</div>
        )}
      </div>

      <div className="memories-carousel-mobile">
        {slides.length > 0 ? (
          <div className="memories-mobile-track">
            {slides.map((item) => (
              <article key={item.id} className="memories-mobile-card">
                <div className="memories-card-media">
                  <img src={item.image} alt="" className="memories-card-bg" aria-hidden="true" loading="lazy" />
                  <img src={item.image} alt="Trip memory" className="memories-card-image" loading="lazy" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="memories-empty">Upload photos to start swiping.</div>
        )}
      </div>
    </section>
  )
}

export default CarouselSection
