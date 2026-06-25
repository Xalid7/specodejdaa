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
    }, { threshold: 0.08 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  })
}

function AnimatedWave({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  const path = flip
    ? 'M0,26 C240,0 480,52 720,26 C960,0 1200,52 1440,26 L1440,52 L0,52 Z'
    : 'M0,26 C240,52 480,0 720,26 C960,52 1200,0 1440,26 L1440,52 L0,52 Z'
  return (
    <div style={{ background: from, lineHeight: 0, overflow: 'hidden', position: 'relative', height: 52 }}>
      <div style={{ animation: 'waveSlide 8s linear infinite', display: 'flex', width: '200%', position: 'absolute', bottom: 0 }}>
        <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{ width: '50%', height: 52, display: 'block', flexShrink: 0 }}>
          <path d={path} fill={to} />
        </svg>
        <svg viewBox="0 0 1440 52" preserveAspectRatio="none" style={{ width: '50%', height: 52, display: 'block', flexShrink: 0 }}>
          <path d={path} fill={to} />
        </svg>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [banners, setBanners] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
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
      setProducts(sample.slice(0, 10))
    }).catch(() => {})
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

      {/* ══════════ HERO ══════════ */}
      <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {banners.length === 0 ? (
          <div style={{ background: 'linear-gradient(-45deg, #C62828, #8B0000, #D32F2F, #7B0000)', backgroundSize: '400% 400%', animation: 'gradientShift 8s ease infinite', minHeight: 520, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Animated background shapes */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '55%', height: '120%', background: 'rgba(255,255,255,0.04)', borderRadius: '60% 0 0 60%', animation: 'float 7s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', bottom: '-20%', left: '30%', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%', animation: 'float 9s ease-in-out infinite reverse' }} />
              <div style={{ position: 'absolute', top: '10%', right: '15%', width: 12, height: 12, background: 'rgba(255,255,255,0.25)', borderRadius: '50%', animation: 'float 4s ease-in-out infinite' }} />
              <div style={{ position: 'absolute', bottom: '25%', right: '25%', width: 8, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', animation: 'float 5s ease-in-out infinite 1s' }} />
              <div style={{ position: 'absolute', top: '40%', right: '8%', width: 6, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: '50%', animation: 'float 6s ease-in-out infinite 0.5s' }} />
            </div>

            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px', width: '100%', position: 'relative', zIndex: 1 }}>
              <div>
                <div className="hero-text-1" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF8A80', animation: 'pulseRed 1.8s ease infinite' }} />
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
                    {lang === 'ru' ? 'Производство в Узбекистане' : "O'zbekistonda ishlab chiqarish"}
                  </span>
                </div>
                <h1 className="hero-text-2" style={{ color: '#fff', fontSize: 'clamp(32px, 5.5vw, 60px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.05, marginBottom: 20 }}>
                  {lang === 'ru' ? <><span style={{ display: 'block' }}>Спецодежда</span><span style={{ display: 'block', color: 'rgba(255,255,255,0.7)' }}>и Униформа</span></> : <><span style={{ display: 'block' }}>Maxsus kiyim</span><span style={{ display: 'block', color: 'rgba(255,255,255,0.7)' }}>va Uniform</span></>}
                </h1>
                <p className="hero-text-3" style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(14px, 1.8vw, 17px)', marginBottom: 36, maxWidth: 420, lineHeight: 1.6 }}>
                  {lang === 'ru' ? 'Производим спецодежду, медицинскую одежду, промотекстиль и брендированную продукцию под заказ' : "Buyurtma asosida maxsus kiyim, tibbiy kiyim, promo to'qimachilik va brendlangan mahsulotlar ishlab chiqaramiz"}
                </p>
                <div className="hero-btns" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/catalog" className="btn-cta" style={{ background: '#fff', color: '#D32F2F', padding: '14px 28px', borderRadius: 99, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M3 12h18M3 18h12"/></svg>
                    {lang === 'ru' ? 'Каталог' : 'Katalog'}
                  </Link>
                  <Link href="/services" style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', padding: '14px 28px', borderRadius: 99, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  >
                    {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <>
            <style>{`
              .hero-banner-img { display: block; width: 100%; height: auto; background: transparent; }
            `}</style>
            <div style={{ display: 'flex', transition: 'transform .5s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${current * 100}%)` }}>
              {banners.map((b: any) => {
                const bare = b.ctaLink && !b.titleRu && !b.ctaText
                const inner = (
                  <div style={{ width: '100%', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
                    <picture>
                      {b.mobileUrl && <source media="(max-width: 768px)" srcSet={b.mobileUrl} />}
                      <img className="hero-banner-img" src={b.imageUrl} alt={b.titleRu || ''} />
                    </picture>
                    {(b.titleRu || b.ctaText) && (
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.1) 50%, transparent 75%)', display: 'flex', alignItems: 'center', padding: '0 5%' }}>
                        <div style={{ maxWidth: 520, color: '#fff' }}>
                          {b.titleRu && <h2 style={{ fontSize: 'clamp(20px, 3.5vw, 42px)', fontWeight: 900, letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.1 }}>{lang === 'ru' ? b.titleRu : b.titleUz}</h2>}
                          {b.subtitleRu && <p style={{ fontSize: 'clamp(13px, 1.8vw, 18px)', opacity: 0.85, marginBottom: 24 }}>{lang === 'ru' ? b.subtitleRu : b.subtitleUz}</p>}
                          {b.ctaText && b.ctaLink && (
                            <Link href={b.ctaLink} style={{ display: 'inline-block', background: '#D32F2F', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>{b.ctaText}</Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
                return (
                  <div key={b.id} style={{ minWidth: '100%', position: 'relative' }}>
                    {bare ? <Link href={b.ctaLink} style={{ display: 'block' }}>{inner}</Link> : inner}
                  </div>
                )
              })}
            </div>
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

      {banners.length === 0 && <AnimatedWave from="#7B0000" to="#fff" />}

      {/* ══════════ PRODUCTS ══════════ */}
      {products.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 24px' }}>
          <div className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ color: '#D32F2F', fontWeight: 700, fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 }}>
                {lang === 'ru' ? 'Ассортимент' : 'Assortiment'}
              </p>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>
                {lang === 'ru' ? 'Популярные товары' : 'Mashhur mahsulotlar'}
              </h2>
            </div>
            <Link href="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#D32F2F', fontWeight: 700, textDecoration: 'none', transition: 'gap .2s' }}
              onMouseEnter={e => (e.currentTarget.style.gap = '10px')}
              onMouseLeave={e => (e.currentTarget.style.gap = '6px')}
            >
              {lang === 'ru' ? 'Весь каталог' : "Barcha mahsulotlar"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="home-products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 20 }}>
            {products.map((p: any, idx: number) => {
              const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
              return (
                <Link key={p.id} href={`/catalog/${p.slug}`} className="product-card-3d reveal"
                  style={{ textDecoration: 'none', display: 'block', borderRadius: 18, overflow: 'visible', transitionDelay: `${idx * 0.05}s` }}
                >
                  <div className="product-card-inner" style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s' }}>
                    <div className="prod-img" style={{ aspectRatio: '4/3', background: '#fff', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {imgs[0] ? (
                        <img src={imgs[0]} alt={p.nameRu} style={{ width: '88%', height: '88%', objectFit: 'contain' }} className="product-img" />
                      ) : (
                        <div style={{ fontSize: 52, color: '#DDD' }}>📦</div>
                      )}
                      {p.isNew && (
                        <span className="badge-anim" style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(135deg,#D32F2F,#FF5252)', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 7, letterSpacing: 0.8, boxShadow: '0 2px 8px rgba(211,47,47,0.4)' }}>NEW</span>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px 16px' }}>
                      <p style={{ fontSize: 11, color: '#D32F2F', marginBottom: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{lang === 'ru' ? p.category?.nameRu : p.category?.nameUz}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {lang === 'ru' ? p.nameRu : p.nameUz}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <AnimatedWave from="#fff" to="#D32F2F" flip />

      {/* ══════════ WHY US ══════════ */}
      <section style={{ background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 12 }}>
              {lang === 'ru' ? 'Почему выбирают нас?' : 'Nima uchun bizni tanlashadi?'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
              {lang === 'ru' ? 'Мы производим качественную продукцию с 2014 года' : "Biz 2014 yildan beri sifatli mahsulot ishlab chiqaramiz"}
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {(lang === 'ru' ? [
              { num: '01', title: 'Собственное производство', desc: 'Современное оборудование на собственной фабрике в Ташкенте' },
              { num: '02', title: 'Быстрое исполнение', desc: 'Выполняем заказы точно в срок, без задержек' },
              { num: '03', title: 'Гарантия качества', desc: 'Каждое изделие проходит ОТК перед отправкой' },
              { num: '04', title: 'Любой тираж', desc: 'От 1 штуки до корпоративных заказов на тысячи единиц' },
            ] : [
              { num: '01', title: "O'z ishlab chiqarish", desc: "Toshkentdagi o'z fabrikamizda zamonaviy uskunalar" },
              { num: '02', title: 'Tez bajarish', desc: "Buyurtmalarni o'z vaqtida, kechiktirmasdan bajaramiz" },
              { num: '03', title: 'Sifat kafolati', desc: "Har bir buyum jo'natishdan oldin tekshiruvdan o'tadi" },
              { num: '04', title: 'Har qanday tirāj', desc: "1 donadan minglab birlikdagi korporativ buyurtmalargacha" },
            ]).map((item, i) => (
              <div key={i} className="reveal" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: '28px 24px', backdropFilter: 'blur(4px)', transition: 'background .25s', transitionDelay: `${i * 0.08}s`, cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                <div style={{ fontSize: 36, fontWeight: 900, color: 'rgba(255,255,255,0.2)', lineHeight: 1, marginBottom: 16 }}>{item.num}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedWave from="#B71C1C" to="#fff" />

      {/* ══════════ ПРОИЗВОДСТВО ══════════ */}
      <section style={{ background: '#fff', padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 900, color: '#111', letterSpacing: -0.5 }}>
              {lang === 'ru' ? 'Производство' : 'Ishlab chiqarish'}
            </h2>
          </div>

          {(() => {
            const items = [
              {
                titleRu: 'Швейное производство',
                titleUz: 'Tikuvchilik ishlab chiqarishi',
                img: 'https://images.unsplash.com/photo-1589793463357-5fb813435467?w=800&q=80',
                descRu: 'Современные швейные машины. Производительность — до 500 единиц в день.',
                descUz: 'Zamonaviy tikuv mashinalari. Kuniga 500 ta birlikgacha ishlab chiqarish.',
              },
              {
                titleRu: 'Нанесение рисунка',
                titleUz: 'Naqsh bosish',
                img: 'https://images.unsplash.com/photo-1663433567177-9f94be0bff4c?w=800&q=80',
                descRu: 'Шелкография, ДТФ-печать, вышивка, сублимация и виниловые нашивки.',
                descUz: 'Shelkografiya, DTF bosma, kashta, sublimatsiya va vinil.',
              },
              {
                titleRu: 'Раскрой и подготовка',
                titleUz: 'Kesish va tayyorlash',
                img: 'https://images.unsplash.com/photo-1718184021018-d2158af6b321?w=800&q=80',
                descRu: 'Точный раскрой ткани по лекалам. Контроль качества на каждом этапе.',
                descUz: "Andozalar bo'yicha aniq mato kesish. Har bosqichda sifat nazorati.",
              },
              {
                titleRu: 'Контроль качества',
                titleUz: 'Sifat nazorati',
                img: 'https://images.unsplash.com/photo-1542044801-30d3e45ae49a?w=800&q=80',
                descRu: 'ОТК проверяет каждое изделие перед отправкой. Гарантия качества.',
                descUz: "Har bir mahsulot jo'natishdan oldin OTK tomonidan tekshiriladi.",
              },
            ]
            return (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {items.map((item, i) => (
                  <div key={i} className="reveal" style={{ borderRadius: 20, overflow: 'hidden', minHeight: 340, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', cursor: 'default', transitionDelay: `${i * 0.08}s` }}>
                    <img src={item.img} alt={item.titleRu} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
                    <div style={{ position: 'relative', padding: '24px 28px 28px' }}>
                      <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>
                        {lang === 'ru' ? item.titleRu : item.titleUz}
                      </h3>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>
                        {lang === 'ru' ? item.descRu : item.descUz}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </section>

      {/* ══════════ PARTNERS ══════════ */}
      <section style={{ padding: '56px 0', background: '#fff', borderTop: '1px solid #F0F0F0' }}>
        <div className="reveal" style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900, color: '#111', letterSpacing: -0.3 }}>
            {lang === 'ru' ? 'Наши партнёры' : 'Hamkorlarimiz'}
          </h2>
        </div>
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #fff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #fff, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div className="marquee-track" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
            {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
              <div key={i} style={{ flexShrink: 0, padding: '0 36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={logo.src} alt={logo.name} style={{ height: 44, width: 'auto', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.5, transition: 'all .3s' }}
                  onMouseEnter={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(100%)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.transform = '' }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedWave from="#fff" to="#111" flip />

      {/* ══════════ CTA ══════════ */}
      <section style={{ background: '#111', padding: '64px 24px' }}>
        <div className="reveal" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: -0.5 }}>
            {lang === 'ru' ? 'Готовы сделать заказ?' : "Buyurtma berishga tayyormisiz?"}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 32, lineHeight: 1.6 }}>
            {lang === 'ru' ? 'Свяжитесь с нами — рассчитаем стоимость и сроки бесплатно' : "Biz bilan bog'laning — narx va muddatni bepul hisoblaymiz"}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contacts" className="btn-cta" style={{ background: '#D32F2F', color: '#fff', padding: '14px 32px', borderRadius: 99, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
              {lang === 'ru' ? 'Связаться с нами' : "Biz bilan bog'lanish"}
            </Link>
            <Link href="/catalog" style={{ background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff', padding: '14px 32px', borderRadius: 99, fontWeight: 600, fontSize: 15, textDecoration: 'none', display: 'inline-block', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              {lang === 'ru' ? 'Смотреть каталог' : "Katalogni ko'rish"}
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .home-products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
        }
        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes waveSlide {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .product-card-3d:hover .product-card-inner {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0,0,0,0.13), 0 4px 12px rgba(211,47,47,0.07) !important;
        }
        .product-card-3d:hover .product-img { transform: scale(1.1); }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseRed {
          0%,100% { box-shadow: 0 0 0 0 rgba(211,47,47,0.4); }
          60% { box-shadow: 0 0 0 8px rgba(211,47,47,0); }
        }
      `}</style>
    </div>
  )
}
