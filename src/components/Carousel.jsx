import { useMemo, useRef, useState } from 'react'

function normalizeImages(images) {
  return (images || []).map((item) => {
    if (typeof item === 'string') {
      return { src: item, alt: 'Gallery image' }
    }
    return {
      src: item.src,
      alt: item.alt || 'Gallery image',
    }
  }).filter((item) => item.src)
}

function Carousel({ images, initialIndex = 0, height = 360, onClose }) {
  const slides = useMemo(() => normalizeImages(images), [images])
  const [active, setActive] = useState(Math.max(0, initialIndex || 0))
  const touchStartX = useRef(null)

  const safeActive = slides.length ? Math.max(0, Math.min(slides.length - 1, active)) : 0
  const prevIndex = slides.length ? (safeActive - 1 + slides.length) % slides.length : 0
  const nextIndex = slides.length ? (safeActive + 1) % slides.length : 0

  const goPrev = () => {
    if (!slides.length) return
    setActive((idx) => (idx - 1 + slides.length) % slides.length)
  }

  const goNext = () => {
    if (!slides.length) return
    setActive((idx) => (idx + 1) % slides.length)
  }

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0]?.clientX
    if (typeof endX !== 'number') return
    const delta = endX - touchStartX.current
    if (Math.abs(delta) > 35) {
      if (delta < 0) goNext()
      if (delta > 0) goPrev()
    }
    touchStartX.current = null
  }

  if (!slides.length) {
    return (
      <div className="premium-carousel empty" style={{ height }}>
        <div className="premium-empty-text">No images yet</div>
      </div>
    )
  }

  return (
    <div className="premium-carousel" style={{ height }}>
      <div className="premium-carousel-core" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <div className="premium-side-preview left" aria-hidden="true">
          <img src={slides[prevIndex].src} alt={slides[prevIndex].alt} />
        </div>

        <div className="premium-main-slide" key={slides[safeActive].src}>
          <img src={slides[safeActive].src} alt={slides[safeActive].alt} />
        </div>

        <div className="premium-side-preview right" aria-hidden="true">
          <img src={slides[nextIndex].src} alt={slides[nextIndex].alt} />
        </div>

        {slides.length > 1 && (
          <>
            <button type="button" className="premium-arrow left" onClick={goPrev} aria-label="Previous slide">
              ‹
            </button>
            <button type="button" className="premium-arrow right" onClick={goNext} aria-label="Next slide">
              ›
            </button>
          </>
        )}

        {onClose && (
          <button type="button" className="premium-close" onClick={onClose} aria-label="Close preview">
            ✕
          </button>
        )}
      </div>

      <div className="premium-indicators" role="tablist" aria-label="Slide indicators">
        {slides.map((slide, idx) => (
          <button
            key={`${slide.src}-${idx}`}
            type="button"
            className={`premium-dot ${idx === safeActive ? 'active' : ''}`}
            onClick={() => setActive(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Carousel
