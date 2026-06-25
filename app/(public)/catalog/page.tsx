'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer, Package } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer,
}

function CatIcon({ name, size = 20, color }: { name?: string; size?: number; color?: string }) {
  if (name === 'Coat') {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color || 'currentColor'} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M27 10 L23 14 L21 56 Q21 58 23 58 L41 58 Q43 58 43 56 L41 14 L37 10" />
        <path d="M23 14 L16 17 L13 33 L18 35 L21 23" />
        <path d="M41 14 L48 17 L51 33 L46 35 L43 23" />
        <path d="M27 10 L32 16 L37 10" />
        <path d="M32 16 L32 57" />
        <path d="M25 44 L29 44" />
        <path d="M39 44 L35 44" />
      </svg>
    )
  }
  const Comp = name ? ICON_MAP[name] : null
  if (!Comp) return <Package size={size} color={color} />
  return <Comp size={size} color={color} />
}

function useReveal() {
  useEffect(() => {
    const run = () => {
      const els = document.querySelectorAll('.reveal')
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } })
      }, { threshold: 0.08 })
      els.forEach(el => io.observe(el))
      return () => io.disconnect()
    }
    return run()
  })
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [drillCat, setDrillCat] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  function toggleExpand(id: string) {
    setExpandedCat(prev => prev === id ? null : id)
  }

  useReveal()

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => { const l = localStorage.getItem('lang') as 'ru'|'uz'|null; if (l) setLang(l) }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  useEffect(() => {
    const catId = searchParams.get('categoryId') || activeCat
    const filter = searchParams.get('filter') || (activeFilter !== 'all' ? activeFilter : null)
    const search = searchParams.get('search')
    const params = new URLSearchParams()
    if (catId) params.set('categoryId', catId)
    if (filter && filter !== 'all') params.set('filter', filter)
    if (search) params.set('search', search)
    setLoading(true)
    fetch(`/api/products?${params}`).then(r => r.json()).then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false) }).catch(() => setLoading(false))
  }, [searchParams, activeFilter, activeCat])

  const filters = [
    { key: 'new', ru: 'НОВИНКИ', uz: 'YANGILAR' },
    { key: 'collection', ru: 'ПОДБОРКИ', uz: 'TANLOVLAR' },
    { key: 'holiday', ru: 'К ПРАЗДНИКАМ', uz: 'BAYRAMGA' },
  ]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>

      {/* SEO heading — vizual yashirin (faqat qidiruv tizimlari uchun) */}
      <h1 style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
        {lang === 'ru' ? 'Каталог спецодежды и униформы в Ташкенте' : "Toshkentda maxsus kiyim va uniforma katalogi"}
      </h1>



      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {(activeCat || drillCat || searchParams.get('categoryId') || searchParams.get('search')) && (
            <button onClick={() => {
              const hasParams = searchParams.get('categoryId') || searchParams.get('search')
              if (hasParams) { setActiveCat(null); setDrillCat(null); router.push('/catalog') }
              else if (activeCat) setActiveCat(null)
              else if (drillCat) setDrillCat(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, padding: '8px 14px', background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 99, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              {lang === 'ru' ? 'Назад' : 'Orqaga'}
            </button>
          )}
          {(!activeCat && !drillCat && !searchParams.get('categoryId') && !searchParams.get('search')) ? (
            /* Katalog ochilganda — asosiy kategoriyalar (ixcham ro'yxat) */
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 440 }}>
              {categories.filter((c: any) => !c.parentId).map((cat: any) => (
                <button key={cat.id} onClick={() => {
                  if (cat.children?.length) setDrillCat(cat)
                  else setActiveCat(cat.id)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                  style={{ cursor: 'pointer', background: '#fff', border: 'none', borderBottom: '1px solid #F0F0F0', padding: '15px 8px', display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left', width: '100%', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFF7F7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36 }}>
                    <CatIcon name={cat.icon} size={32} color="#D32F2F" />
                  </span>
                  <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: '#111' }}>{lang === 'ru' ? cat.nameRu : cat.nameUz}</span>
                  <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#D32F2F', background: '#FDECEC', borderRadius: 99, padding: '2px 10px', minWidth: 28, textAlign: 'center' }}>{cat._count?.products ?? 0}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          ) : (drillCat && !activeCat) ? (
            /* Subkategoriyalar ro'yxati */
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 440 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#111', padding: '4px 8px 12px' }}>{lang === 'ru' ? drillCat.nameRu : drillCat.nameUz}</div>
              {drillCat.children.map((sub: any) => (
                <button key={sub.id} onClick={() => { setActiveCat(sub.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{ cursor: 'pointer', background: '#fff', border: 'none', borderBottom: '1px solid #F0F0F0', padding: '14px 8px', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', width: '100%', transition: 'background .15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FFF7F7')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D32F2F', flexShrink: 0, marginLeft: 4 }} />
                  <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#222' }}>{lang === 'ru' ? sub.nameRu : sub.nameUz}</span>
                  <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: '#D32F2F', background: '#FDECEC', borderRadius: 99, padding: '2px 10px', minWidth: 28, textAlign: 'center' }}>{sub._count?.products ?? 0}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          ) : loading ? (
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
                  <div className="skeleton" style={{ aspectRatio: '1' }} />
                  <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                    <div className="skeleton" style={{ height: 14 }} />
                    <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#999' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#555' }}>{lang === 'ru' ? 'Товары не найдены' : 'Mahsulotlar topilmadi'}</p>
              <p style={{ fontSize: 14 }}>{lang === 'ru' ? 'В этой категории пока нет товаров' : "Bu kategoriyada hali mahsulot yo'q"}</p>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>{lang === 'ru' ? `Найдено товаров: ${products.length}` : `${products.length} ta mahsulot topildi`}</p>
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {products.map((p: any, idx: number) => {
                  const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
                  const delay = `${(idx % 10) * 0.04}s`
                  return (
                    <Link key={p.id} href={`/catalog/${p.slug}`} className="product-card reveal"
                      style={{ textDecoration: 'none', background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', display: 'block', transitionDelay: delay }}
                    >
                      <div className="prod-img" style={{ aspectRatio: '1', background: '#fff', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {imgs[0] ? (
                          <img src={imgs[0]} alt={lang === 'ru' ? p.nameRu : p.nameUz} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#DDD' }}>📦</div>
                        )}
                        {(p.isNew || p.isCollection) && (
                          <span className="badge-anim" style={{ position: 'absolute', top: 8, left: 8, background: p.isNew ? '#D32F2F' : '#1565C0', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
                            {p.isNew ? 'NEW' : 'HIT'}
                          </span>
                        )}
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: 12, color: '#D32F2F', marginBottom: 4, fontWeight: 600 }}>{lang === 'ru' ? p.category?.nameRu : p.category?.nameUz}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {lang === 'ru' ? p.nameRu : p.nameUz}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* SEO text block */}
      <section style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid #EEE', color: '#666', fontSize: 13.5, lineHeight: 1.8 }}>
        {lang === 'ru' ? (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#333', marginBottom: 10 }}>Пошив спецодежды и униформы на заказ в Ташкенте</h2>
            <p style={{ marginBottom: 10 }}>
              ООО «ART PRINT AND TEXTILE» — производство спецодежды и униформы в Узбекистане. Шьём на заказ <b>рабочую одежду</b>, летнюю и зимнюю,
              <b> комбинезоны</b> и полукомбинезоны, <b>костюмы сварщика</b>, одежду и костюмы для охранников, сигнальные жилетки.
            </p>
            <p style={{ marginBottom: 10 }}>
              <b>Медицинская одежда</b> и хирургическая форма, <b>поварская одежда</b>, фартуки, колпаки и одежда для горничных.
              Корпоративный текстиль: <b>футболки</b>, поло, рубашки, толстовки, свитшоты, кепки, бейсболки, панамы и шапки с логотипом.
            </p>
            <p>
              А также <b>промотекстиль</b> и текстиль для дома: постельное бельё, подушки и наволочки, пледы, скатерти, салфетки,
              махровые и вафельные полотенца, эко-сумки и бязевые сумки, перчатки, рукавицы, дождевики, зонты, платки и маски.
              Любой тираж, нанесение логотипа, доставка по Ташкенту и Узбекистану.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#333', marginBottom: 10 }}>Toshkentda maxsus kiyim va uniforma buyurtmaga tikish</h2>
            <p style={{ marginBottom: 10 }}>
              ООО «ART PRINT AND TEXTILE» — O'zbekistonda maxsus kiyim va uniforma ishlab chiqarish. Buyurtmaga <b>ishchi kiyimlar</b> (yozgi va qishki),
              kombinezonlar, <b>payvandchi kostyumlari</b>, soqchilar uchun kiyim va signal jiletkalar tikamiz.
            </p>
            <p style={{ marginBottom: 10 }}>
              <b>Tibbiy kiyim</b> va jarrohlik formasi, <b>oshpaz kiyimi</b>, fartuklar va kolpaklar. Korporativ tekstil:
              futbolkalar, polo, ko'ylaklar, tolstovkalar, svitshotlar, keplar va panamalar — logotip bilan.
            </p>
            <p>
              Shuningdek promo tekstil va uy tekstili: ko'rpa-to'shak, yostiq va yostiq jildlari, pledlar, dasturxonlar, sochiqlar,
              eko-sumkalar, qo'lqoplar, yomg'irpo'shlar, soyabonlar va niqoblar. Har qanday tiraj, logotip bosish, Toshkent bo'ylab yetkazib berish.
            </p>
          </>
        )}
      </section>

      <style>{`
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }
          .sidebar-toggle { display: block !important; }
          .catalog-sidebar { display: none; width: 100% !important; margin-bottom: 16px; }
          .catalog-sidebar.open { display: block !important; }
        }
      `}</style>
    </div>
  )
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>
}
