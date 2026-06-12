'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

const PARTNER_LOGOS = [
  { src: '/partners/akfa_logo.svg', name: 'Akfa' },
  { src: '/partners/cocacola_logo.svg', name: 'Coca-Cola' },
  { src: '/partners/evos_logo.svg', name: 'EVOS' },
  { src: '/partners/golden_house_logo.svg', name: 'Golden House' },
  { src: '/partners/kapitalbank_logo.svg', name: 'Kapital Bank' },
  { src: '/partners/lg_logo.svg', name: 'LG' },
  { src: '/partners/murad_buildings_logo.svg', name: 'Murad Buildings' },
  { src: '/partners/pepsi_logo.svg', name: 'Pepsi' },
  { src: '/partners/romstar_logo.svg', name: 'Romstar' },
  { src: '/partners/samsung_logo.svg', name: 'Samsung' },
  { src: '/partners/undp_logo.svg', name: 'UNDP' },
  { src: '/partners/uzauto_motors_logo.svg', name: 'UzAuto Motors' },
  { src: '/partners/uzbekneftegaz_logo.svg', name: 'Uzbekneftegaz' },
]

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left')
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } })
    }, { threshold: 0.1 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

export default function HomePage() {
  const [banners, setBanners] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [partners, setPartners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const intervalRef = useRef<any>(null)

  useReveal()

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => { const l = localStorage.getItem('lang') as 'ru'|'uz'|null; if (l) setLang(l) }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/banners').then(r => r.json()).then(setBanners).catch(() => {})
    fetch('/api/products').then(r => r.json()).then(d => {
      if (!Array.isArray(d)) return setProducts([])
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
          <div style={{ background: 'linear-gradient(135deg, #D32F2F 0%, #7B0000 100%)', minHeight: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 50%, rgba(255,80,80,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p className="hero-text-1" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}>Art Print & Textile</p>
              <h1 className="hero-text-2" style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, letterSpacing: -1, lineHeight: 1.1, marginBottom: 16 }}>
                {lang === 'ru' ? <>Производство<br/>спецодежды</> : <>Maxsus kiyim<br/>ishlab chiqarish</>}
              </h1>
              <p className="hero-text-3" style={{ color: 'rgba(255,255,255,0.78)', fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: 32, maxWidth: 480 }}>
                {lang === 'ru' ? 'Спецодежда, униформа и брендированная продукция в Узбекистане' : "O'zbekistonda maxsus kiyim, uniform va brendlangan mahsulotlar"}
              </p>
              <div className="hero-btns" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/catalog" className="btn-cta" style={{ background: '#fff', color: '#D32F2F', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'inline-block' }}>
                  {lang === 'ru' ? 'Смотреть каталог' : "Katalogni ko'rish"}
                </Link>
                <Link href="/contacts" style={{ border: '2px solid rgba(255,255,255,0.55)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: 'none', transition: 'background .2s', display: 'inline-block' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
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
                  <div style={{ width: '100%', aspectRatio: '16/9', minHeight: 320, background: '#f5f5f5', position: 'relative', overflow: 'hidden' }}>
                    <img src={b.imageUrl} alt={b.titleRu || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                    {(b.titleRu || b.ctaText) && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
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
                    )}
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
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 64px' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <h2 className="section-title" style={{ fontSize: 26, fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>{lang === 'ru' ? 'Товары' : 'Mahsulotlar'}</h2>
            <Link href="/catalog" style={{ fontSize: 14, color: '#D32F2F', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, transition: 'gap .2s' }}
              onMouseEnter={e => (e.currentTarget.style.gap = '8px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '4px')}
            >
              {lang === 'ru' ? 'Все товары' : "Barchasini ko'rish"} →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 24 }}>
            {products.map((p: any, idx: number) => {
              const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
              const delay = `${idx * 0.06}s`
              return (
                <Link key={p.id} href={`/catalog/${p.slug}`} className="product-card-3d reveal"
                  style={{ textDecoration: 'none', display: 'block', borderRadius: 20, overflow: 'visible', position: 'relative', transitionDelay: delay, animationDelay: delay }}
                >
                  <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)',
                    transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s cubic-bezier(.2,.8,.2,1)',
                  }} className="product-card-inner">
                    <div className="prod-img" style={{ aspectRatio: '4/3', background: '#fff', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imgs[0] ? (
                        <img src={imgs[0]} alt={p.nameRu} style={{ width: '88%', height: '88%', objectFit: 'contain' }} className="product-img" />
                      ) : (
                        <div style={{ fontSize: 52, color: '#DDD' }}>📦</div>
                      )}
                      {p.isNew && (
                        <span className="badge-anim" style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(135deg,#D32F2F,#FF5252)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: 1, boxShadow: '0 2px 8px rgba(211,47,47,0.4)' }}>NEW</span>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px 18px' }}>
                      <p style={{ fontSize: 11, color: '#D32F2F', marginBottom: 5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{lang === 'ru' ? p.category?.nameRu : p.category?.nameUz}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {lang === 'ru' ? p.nameRu : p.nameUz}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          <style>{`
            .product-card-3d:hover .product-card-inner {
              transform: translateY(-8px) scale(1.02);
              box-shadow: 0 20px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(211,47,47,0.08);
            }
            .product-card-3d:hover .product-img { transform: scale(1.1); }
            @media (max-width: 480px) { .product-card-3d { min-width: 0; } }
          `}</style>
        </section>
      )}

      {/* ─── WHY US ─── */}
      <section style={{ background: '#FAFAFA', borderTop: '1px solid #F0F0F0', borderBottom: '1px solid #F0F0F0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 16px' }}>
          <h2 className="reveal" style={{ fontSize: 22, fontWeight: 800, color: '#111', textAlign: 'center', marginBottom: 36, letterSpacing: -0.3, display: 'block' }}>
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
              <div key={i} className="reveal service-card" style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '24px 20px', textAlign: 'center', transitionDelay: `${i * 0.08}s` }}>
                <div style={{ fontSize: 40, marginBottom: 14, display: 'inline-block', transition: 'transform .3s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.25) rotate(-5deg)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >{item.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PARTNERS MARQUEE ─── */}
      <section style={{ padding: '48px 0', borderTop: '1px solid #F0F0F0' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', textAlign: 'center', marginBottom: 32, letterSpacing: -0.3 }}>
          {lang === 'ru' ? 'Наши партнёры' : 'Hamkorlarimiz'}
        </h2>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div className="marquee-track">
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} style={{ flexShrink: 0, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo.src} alt={logo.name} style={{ height: 48, width: 'auto', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.55, transition: 'all .3s' }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.opacity = '1' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = '0.55' }}
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .marquee-track {
            display: flex;
            align-items: center;
            animation: marquee 28s linear infinite;
            width: max-content;
          }
          .marquee-track:hover { animation-play-state: paused; }
          @keyframes marquee {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    </div>
  )
}
