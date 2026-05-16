import { useEffect, useState } from 'react'

const GALLERY_STORAGE_KEY = 'kerala-memories-shelves-v1'

const MEMORY_SHELVES = [
  {
    id: 'friends',
    title: 'Friends & Fun',
    caption: 'Laughter, selfies, and the crew that made it real.',
  },
  {
    id: 'moments',
    title: 'Little Moments',
    caption: 'Small details that turn into big stories.',
  },
  {
    id: 'landscapes',
    title: 'Landscapes',
    caption: 'Tea hills, mist, and the greenest horizons.',
  },
  {
    id: 'food',
    title: 'Kerala Feast',
    caption: 'Banana leaf spreads and spice-sweet memories.',
  },
]

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

function Gallery() {
  const [galleryState, setGalleryState] = useState(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : {}
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryState))
  }, [galleryState])

  const handleUpload = async (shelfId, event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const encoded = await Promise.all(
      files.map(async (file, idx) => ({
        id: `${shelfId}-${file.name}-${file.lastModified}-${idx}-${Date.now()}`,
        src: await readFileAsDataUrl(file),
        alt: `${shelfId} memory`,
      })),
    )

    setGalleryState((current) => {
      const existing = current[shelfId] || []
      return {
        ...current,
        [shelfId]: [...existing, ...encoded],
      }
    })

    event.target.value = ''
  }

  const clearShelf = (shelfId) => {
    setGalleryState((current) => ({
      ...current,
      [shelfId]: [],
    }))
  }

  return (
    <div className="memory-upload-grid">
      {MEMORY_SHELVES.map((shelf) => {
        const images = galleryState[shelf.id] || []
        const inputId = `memory-shelf-${shelf.id}`
        return (
          <section key={shelf.id} className="memory-upload-card">
            <div className="memory-upload-head">
              <div>
                <div className="memory-upload-title">{shelf.title}</div>
                <p className="memory-upload-caption">{shelf.caption}</p>
              </div>
            </div>
            <div className="memory-upload-track" aria-label={`${shelf.title} uploads`}>
              {images.length ? (
                images.map((image) => (
                  <figure key={image.id} className="memory-upload-item">
                    <img src={image.src} alt={image.alt} loading="lazy" />
                  </figure>
                ))
              ) : (
                <div className="memory-upload-empty">Drop memories here.</div>
              )}
            </div>
            <div className="memory-upload-actions">
              <label className="memory-upload-btn" htmlFor={inputId}>Upload</label>
              <input
                id={inputId}
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => handleUpload(shelf.id, event)}
              />
              <button type="button" className="memory-upload-clear" onClick={() => clearShelf(shelf.id)}>Clear</button>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default Gallery
