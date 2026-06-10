'use client'
import { useState } from 'react'

export default function ProductGallery({ images, name }: { images: string[], name: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div style={{ aspectRatio: '1', background: '#F8F8F8', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>📦</div>
    )
  }

  return (
    <div>
      <div style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', background: '#F8F8F8', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={images[active]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: `2px solid ${i === active ? '#D32F2F' : 'transparent'}`, background: '#F8F8F8', padding: 4, cursor: 'pointer', transition: 'border-color .2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
