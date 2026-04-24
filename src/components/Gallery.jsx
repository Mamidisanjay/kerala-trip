import { useEffect, useMemo, useState } from 'react'
import Carousel from './Carousel'

const GALLERY_STORAGE_KEY = 'kerala-gallery-v1'

const CATEGORIES = [
  'Arrival Dawn',
  'Tea Gardens',
  'Waterfalls',
  'Houseboat Life',
  'Wildlife',
  'Backwater Sunset',
  'Kerala Feast',
  'Culture',
  'Tropical Flora',
  'Adventure Park',
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
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
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
  const [previewIndex, setPreviewIndex] = useState(null)

  useEffect(() => {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryState))
  }, [galleryState])

  const selectedImages = useMemo(() => galleryState[selectedCategory] || [], [galleryState, selectedCategory])

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    const encoded = await Promise.all(
      files.map(async (file, idx) => ({
        id: `${file.name}-${file.lastModified}-${idx}-${Date.now()}`,
        src: await readFileAsDataUrl(file),
        alt: `${selectedCategory} memory`,
      })),
    )

    setGalleryState((current) => {
      const existing = current[selectedCategory] || []
      return {
        ...current,
        [selectedCategory]: [...existing, ...encoded],
      }
    })

    event.target.value = ''
  }

  const clearCategory = () => {
    setGalleryState((current) => ({
      ...current,
      [selectedCategory]: [],
    }))
    setPreviewIndex(null)
  }

  return (
    <div className="gallery-shell glass-card" style={{ padding: 24 }}>
      <div className="gallery-head">
        <div>
          <div className="badge" style={{ marginBottom: 10 }}>🖼️ Travel Gallery</div>
          <h3 className="gallery-title">Curated Memories by Category</h3>
        </div>

        <div className="gallery-controls">
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <input type="file" accept="image/*" multiple onChange={handleUpload} />
          <button type="button" onClick={clearCategory}>Clear</button>
        </div>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((category) => {
          const count = (galleryState[category] || []).length
          return (
            <button
              type="button"
              key={category}
              className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
              <span>{count} photos</span>
            </button>
          )
        })}
      </div>

      <div className="gallery-layout">
        <div className="gallery-grid">
          {selectedImages.length ? (
            selectedImages.map((image, idx) => (
              <button
                key={image.id}
                type="button"
                className="gallery-image-tile"
                onClick={() => setPreviewIndex(idx)}
                aria-label={`Open image ${idx + 1}`}
              >
                <img src={image.src} alt={image.alt} />
              </button>
            ))
          ) : (
            <div className="gallery-empty">Upload images to this category</div>
          )}
        </div>

        <div className="gallery-carousel-panel">
          <Carousel images={selectedImages} height={320} />
        </div>
      </div>

      {previewIndex !== null && selectedImages.length > 0 && (
        <div className="gallery-preview">
          <button type="button" className="gallery-preview-backdrop" onClick={() => setPreviewIndex(null)} aria-label="Close preview" />
          <div className="gallery-preview-body">
            <Carousel images={selectedImages} initialIndex={previewIndex} height={480} onClose={() => setPreviewIndex(null)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Gallery
