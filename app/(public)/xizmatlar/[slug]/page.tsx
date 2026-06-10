'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function XizmatlarPage() {
  const params = useParams()
  const [service, setService] = useState<any>(null)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLang = () => { const l = localStorage.getItem('lang') as 'ru'|'uz'|null; if (l) setLang(l) }
    window.addEventListener('langchange', onLang)

    fetch('/api/nav-services')
      .then(r => r.json())
      .then((services: any[]) => {
        const found = services.find((s: any) => s.slug === params.slug)
        setService(found || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    return () => window.removeEventListener('langchange', onLang)
  }, [params.slug])

  if (loading) return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 16px', textAlign: 'center', color: '#bbb' }}>
      <div style={{ fontSize: 40 }}>⏳</div>
    </div>
  )

  if (!service) return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
      <p style={{ fontSize: 16, color: '#999' }}>Xizmat topilmadi</p>
      <Link href="/" style={{ color: '#D32F2F', marginTop: 16, display: 'inline-block' }}>← Bosh sahifa</Link>
    </div>
  )

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px 60px' }}>
      {/* Hero */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 36, position: 'relative', minHeight: 240, background: 'linear-gradient(135deg,#D32F2F,#7B0000)', display: 'flex', alignItems: 'flex-end' }}>
        {service.imageUrl && (
          <img src={service.imageUrl} alt={service.nameRu} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
        <div style={{ position: 'relative', padding: '28px 32px', color: '#fff' }}>
          <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>
            {lang === 'ru' ? 'Нанесение логотипа' : 'Logo bosish'}
          </p>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 900, letterSpacing: -0.5 }}>
            {lang === 'ru' ? service.nameRu : service.nameUz}
          </h1>
        </div>
      </div>

      {/* Service products */}
      {service.products?.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {service.products.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
              {p.imageUrl && (
                <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#F0F0F0' }}>
                  <img src={p.imageUrl} alt={p.nameRu} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 6 }}>{lang === 'ru' ? p.nameRu : p.nameUz}</p>
                {p.descRu && <p style={{ fontSize: 13, color: '#777', lineHeight: 1.6 }}>{lang === 'ru' ? p.descRu : p.descUz}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
          <p style={{ fontSize: 15, color: '#999', marginBottom: 20 }}>
            {lang === 'ru' ? 'Контент скоро появится' : 'Kontent tez orada qo\'shiladi'}
          </p>
          <Link href="/contacts" style={{ background: '#D32F2F', color: '#fff', padding: '12px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>
            {lang === 'ru' ? 'Связаться с нами' : 'Biz bilan bog\'lanish'}
          </Link>
        </div>
      )}
    </div>
  )
}
