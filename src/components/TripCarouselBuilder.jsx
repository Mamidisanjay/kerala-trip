import { useEffect, useMemo, useState } from 'react'
import Carousel from './Carousel'

const TRIP_CAROUSEL_STORAGE_KEY = 'kerala-trip-carousel-v1'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

function TripCarouselBuilder() {
  const [images, setImages] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(TRIP_CAROUSEL_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    window.localStorage.setItem(TRIP_CAROUSEL_STORAGE_KEY, JSON.stringify(images))
  }, [images])

  const carouselImages = useMemo(
    () => images.map((item) => ({ src: item.src, alt: item.alt })),
    [images],
  )

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const encoded = await Promise.all(
      files.map(async (file, idx) => ({
        id: `${file.name}-${file.lastModified}-${Date.now()}-${idx}`,
        src: await readFileAsDataUrl(file),
        alt: `Trip memory ${idx + 1}`,
      })),
    )

    setImages((current) => [...current, ...encoded])
    event.target.value = ''
  }

  const clearAll = () => {
    setImages([])
    setPreviewOpen(false)
  }

  return (
    <div className="trip-carousel-shell glass-card">
      <div className="trip-carousel-head">
        <div>
          <div className="badge" style={{ marginBottom: 10 }}>🎞️ Whole Trip Carousel</div>
          <h3 className="trip-carousel-title">Upload 5-6 or more photos and watch your story come alive</h3>
          <p className="trip-carousel-sub">Unlimited uploads. Images stay saved on this device.</p>
        </div>

        <div className="trip-carousel-controls">
          <label className="trip-upload-btn" htmlFor="trip-carousel-input">Add Trip Photos</label>
          <input id="trip-carousel-input" type="file" accept="image/*" multiple onChange={handleUpload} />
          <button type="button" onClick={clearAll}>Clear All</button>
        </div>
      </div>

      <div className="trip-carousel-meta">
        <span>{images.length} photos selected</span>
        {images.length >= 5 && <span>Ready for beautiful playback</span>}
      </div>

      <div className="trip-carousel-stage" onClick={() => images.length && setPreviewOpen(true)} role="button" tabIndex={0} onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          if (images.length) setPreviewOpen(true)
        }
      }}>
        <Carousel images={carouselImages} height={420} />
      </div>

      <div className="trip-thumb-strip" aria-label="Trip thumbnails">
        {images.length ? images.map((image, idx) => (
          <button key={image.id} type="button" className="trip-thumb-tile" onClick={() => setPreviewOpen(true)} aria-label={`Open carousel with photo ${idx + 1}`}>
            <img src={image.src} alt={image.alt} />
          </button>
        )) : <div className="trip-thumb-empty">Add photos to generate your film-strip carousel</div>}
      </div>

      {previewOpen && images.length > 0 && (
        <div className="gallery-preview">
          <button type="button" className="gallery-preview-backdrop" onClick={() => setPreviewOpen(false)} aria-label="Close preview" />
          <div className="gallery-preview-body">
            <Carousel images={carouselImages} height={500} onClose={() => setPreviewOpen(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default TripCarouselBuilder
