'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [banners, setBanners] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => { const l = localStorage.getItem('lang') as 'ru'|'uz'|null; if (l) setLang(l) }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/banners').then(r => r.json()).then(setBanners).catch(() => {})
    fetch('/api/products').then(r => r.json()).then(d => {
      if (!Array.isArray(d)) return setProducts([])
      // 1 product per category
      const seen = new Set<string>()
      const sample: any[] = []
      for (const p of d) {
        if (!seen.has(p.categoryId)) { seen.add(p.categoryId); sample.push(p) }
      }
      setProducts(sample)
    }).catch(() => {})
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
    fetch('/api/partners').then(r => r.json()).then(setPartners).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  const goNext = useCallback(() => setCurrent(c => (c + 1) % Math.max(banners.length, 1)), [banners.length])
  const goPrev = useCallback(() => setCurrent(c => (c - 1 + Math.max(banners.length, 1)) % Math.max(banners.length, 1)), [banners.length])

  useEffect(() => {
    if (banners.length < 2) return
    intervalRef.current = setInterval(goNext, 5000)
    return () => clearInterval(intervalRef.current)
  }, [banners.length, goNext])

  return (
    <div>
      {/* ─── HERO SLIDER ─── */}
      <section style={{ position: 'relative', width: '100%', background: '#111', overflow: 'hidden' }}>
        {banners.length === 0 ? (
          <div style={{ background: 'linear-gradient(135deg, #D32F2F 0%, #7B0000 100%)', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>Art Print & Textile</p>
              <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>
                {lang === 'ru' ? <>Производство<br/>спецодежды</> : <>Maxsus kiyim<br/>ishlab chiqarish</>}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: 32, maxWidth: 480 }}>
                {lang === 'ru' ? 'Спецодежда, unifорма и брендированная продукция в Узбекистане' : "O'zbekistonda maxsus kiyim, uniform va brendlangan mahsulotlar"}
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/catalog" style={{ background: '#fff', color: '#D32F2F', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'transform .2s, box-shadow .2s', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                  {lang === 'ru' ? 'Смотреть каталог' : "Katalogni ko'rish"}
                </Link>
                <Link href="/contacts" style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                  {lang === 'ru' ? 'Связаться' : "Bog'lanish"}
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', transition: 'transform .5s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${current * 100}%)` }}>
              {banners.map((b: any) => (
                <div key={b.id} style={{ minWidth: '100%', position: 'relative' }}>
                  <div style={{ width: '100%', aspectRatio: '16/6', minHeight: 280, background: '#222', position: 'relative', overflow: 'hidden' }}>
                    <img src={b.imageUrl} alt={b.titleRu || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 60%)', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
                      <div style={{ maxWidth: 520, color: '#fff' }}>
                        {b.titleRu && <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 42px)', fontWeight: 900, letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.1 }}>{lang === 'ru' ? b.titleRu : b.titleUz}</h2>}
                        {b.subtitleRu && <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', opacity: 0.85, marginBottom: 24 }}>{lang === 'ru' ? b.subtitleRu : b.subtitleUz}</p>}
                        {b.ctaText && b.ctaLink && (
                          <Link href={b.ctaLink} style={{ display: 'inline-block', background: '#D32F2F', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                            {b.ctaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            {banners.length > 1 && (
              <>
                <button onClick={goPrev} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <button onClick={goNext} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', zIndex: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 10 }}>
                  {banners.map((_: any, i: number) => (
                    <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 99, background: i === current ? '#D32F2F' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>

      {/* ─── PRODUCTS ─── */}
      {products.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: -0.3 }}>{lang === 'ru' ? 'Товары' : 'Mahsulotlar'}</h2>
            <Link href="/catalog" style={{ fontSize: 13, color: '#D32F2F', fontWeight: 600, textDecoration: 'none' }}>{lang === 'ru' ? 'Все товары →' : "Barchasini ko'rish →"}</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {products.map((p: any) => {
              const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
              return (
                <Link key={p.id} href={`/catalog/${p.slug}`}
                  style={{ textDecoration: 'none', background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', transition: 'all .2s', display: 'block' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#E0E0E0'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.transform = '' }}
                >
                  <div style={{ aspectRatio: '1', background: '#F8F8F8', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {imgs[0] ? (
                      <img src={imgs[0]} alt={p.nameRu} style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform .4s' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = '')}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#DDD' }}>📦</div>
                    )}
                    {p.isNew && (
                      <span style={{ position: 'absolute', top: 10, left: 10, background: '#D32F2F', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, letterSpacing: 0.5 }}>NEW</span>
                    )}
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <p style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>{lang === 'ru' ? p.category?.nameRu : p.category?.nameUz}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {lang === 'ru' ? p.nameRu : p.nameUz}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ─── WHY US ─── */}
      <section style={{ background: '#FAFAFA', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 16px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', textAlign: 'center', marginBottom: 36, letterSpacing: -0.3 }}>
            {lang === 'ru' ? 'Почему ART PRINT?' : 'Nima uchun ART PRINT?'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {(lang === 'ru' ? [
              { icon: '🏭', title: 'Собственное производство', desc: 'Современное оборудование и собственный склад' },
              { icon: '⚡', title: 'Быстрое исполнение', desc: 'Доставляем заказ в указанные сроки' },
              { icon: '✅', title: 'Гарантия качества', desc: 'Каждый продукт проходит контроль качества' },
              { icon: '👔', title: 'Широкий ассортимент', desc: 'Спецодежда, медицинская одежда, мерч и другое' },
            ] : [
              { icon: '🏭', title: "O'z ishlab chiqarish", desc: "Zamonaviy uskunalar va o'z omborimiz" },
              { icon: '⚡', title: 'Tez bajarish', desc: 'Buyurtmani belgilangan muddatda yetkazamiz' },
              { icon: '✅', title: 'Sifat kafolati', desc: "Har bir mahsulot sifat nazoratidan o'tadi" },
              { icon: '👔', title: 'Keng assortiment', desc: 'Maxsus kiyim, tibbiy kiyim, merch va boshqalar' },
            ]).map((item, i) => (
              <div key={i} style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      {partners.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 16px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', textAlign: 'center', marginBottom: 32, letterSpacing: -0.3 }}>{lang === 'ru' ? 'Наши партнёры' : 'Hamkorlarimiz'}</h2>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            {partners.map((p: any) => (
              <div key={p.id} style={{ padding: '16px 24px', border: '1.5px solid #F0F0F0', borderRadius: 12 }}>
                <img src={p.logoUrl} alt={p.name || ''} style={{ height: 40, objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.6, transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = '0.6' }}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
