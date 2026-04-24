import { useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'kerala-memories-carousel-v3'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

function CarouselSection() {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed.filter((item) => item?.image) : []
    } catch {
      return []
    }
  })
  const [stageWidth, setStageWidth] = useState(1000)
  const [isPaused, setIsPaused] = useState(false)

  const stageRef = useRef(null)
  const ringRef = useRef(null)

  const rotationRef = useRef(180)
  const velocityRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerXRef = useRef(0)

  const slides = useMemo(() => items.filter((item) => item?.image), [items])
  const stepDeg = slides.length ? 360 / slides.length : 0

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    const node = stageRef.current
    if (!node || typeof ResizeObserver === 'undefined') return undefined

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width
      if (width) setStageWidth(width)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let frame = null
    let prev = performance.now()

    const tick = (now) => {
      const dt = Math.min(2.2, (now - prev) / 16.666)
      prev = now

      if (!draggingRef.current) {
        if (!isPaused) {
          rotationRef.current += (0.24 + velocityRef.current) * dt
        }
        velocityRef.current *= isPaused ? 0.88 : 0.94
        if (Math.abs(velocityRef.current) < 0.0008) velocityRef.current = 0
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `rotateX(0deg) rotateY(${rotationRef.current}deg)`
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [isPaused])

  const onPointerDown = (event) => {
    draggingRef.current = true
    pointerXRef.current = event.clientX
    if (stageRef.current) stageRef.current.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event) => {
    if (!draggingRef.current) return

    const delta = event.clientX - pointerXRef.current
    pointerXRef.current = event.clientX

    rotationRef.current += delta * 0.36
    velocityRef.current = delta * 0.011

    if (ringRef.current) {
      ringRef.current.style.transform = `rotateX(0deg) rotateY(${rotationRef.current}deg)`
    }
  }

  const onPointerUp = (event) => {
    draggingRef.current = false
    if (stageRef.current) stageRef.current.releasePointerCapture(event.pointerId)
  }

  const rotateByStep = (direction) => {
    if (!slides.length) return
    rotationRef.current += direction * stepDeg
    velocityRef.current += direction * 0.03
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
    rotationRef.current = 180
    velocityRef.current = 0
  }

  const ringRadius = Math.max(260, Math.min(760, stageWidth * 0.5))
  const cardWidth = Math.max(240, Math.min(520, stageWidth * 0.34))
  const cardHeight = Math.round(cardWidth * 0.56)

  return (
    <section className="memories-carousel-full ring-cinematic">
      <div className="memories-carousel-bg" aria-hidden="true">
        <span>MEMORIES</span>
      </div>
      <div className="ring-ambient" aria-hidden="true">
        <i className="orb orb-a" />
        <i className="orb orb-b" />
        <i className="orb orb-c" />
      </div>

      <header className="memories-carousel-head">
        <div className="badge">🎠 Infinite Memory Ring</div>
        <div className="memories-carousel-controls">
          <label className="memories-btn primary" htmlFor="memories-carousel-upload">Add Photos</label>
          <input id="memories-carousel-upload" type="file" accept="image/*" multiple onChange={handleUpload} />
          <button
            type="button"
            className="memories-btn"
            onClick={() => setIsPaused((current) => !current)}
          >
            {isPaused ? 'Play' : 'Pause'}
          </button>
          <button type="button" className="memories-btn" onClick={clearAll}>Clear</button>
        </div>
      </header>

      <div className="memories-carousel-desktop ring-desktop">
        {slides.length > 0 ? (
          <>
            <button type="button" className="memories-arrow left" onClick={() => rotateByStep(-1)} aria-label="Rotate left">‹</button>

            <div
              ref={stageRef}
              className="ring-stage"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                '--ring-radius': `${ringRadius}px`,
                '--ring-card-width': `${cardWidth}px`,
                '--ring-card-height': `${cardHeight}px`,
              }}
            >
              <div ref={ringRef} className="ring-core">
                {slides.map((item, index) => (
                  <article
                    key={item.id}
                    className="ring-card"
                    style={{ transform: `rotateY(${index * stepDeg}deg) translateZ(var(--ring-radius))` }}
                  >
                    <div className="ring-card-media">
                      <img src={item.image} alt="" className="ring-card-bg" aria-hidden="true" loading="lazy" />
                      <img src={item.image} alt="Trip memory" className="ring-card-image" loading="lazy" />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button type="button" className="memories-arrow right" onClick={() => rotateByStep(1)} aria-label="Rotate right">›</button>
          </>
        ) : (
          <div className="memories-empty">Upload any number of photos to spin your infinite cinematic ring.</div>
        )}
      </div>

      <div className="memories-carousel-mobile ring-mobile">
        {slides.length > 0 ? (
          <div className="memories-mobile-track">
            {slides.map((item) => (
              <article key={item.id} className="memories-mobile-card">
                <div className="ring-card-media">
                  <img src={item.image} alt="" className="ring-card-bg" aria-hidden="true" loading="lazy" />
                  <img src={item.image} alt="Trip memory" className="ring-card-image" loading="lazy" />
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
