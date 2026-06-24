'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer, Package } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer,
}

function CatIcon({ name, size = 20, color }: { name?: string; size?: number; color?: string }) {
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
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCat, setActiveCat] = useState<string | null>(null)
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

      {/* SEO heading */}
      <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111', marginBottom: 6 }}>
        {lang === 'ru' ? 'Каталог спецодежды и униформы в Ташкенте' : "Toshkentda maxsus kiyim va uniforma katalogi"}
      </h1>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 20, maxWidth: 760, lineHeight: 1.6 }}>
        {lang === 'ru'
          ? 'Рабочая одежда, медицинская и поварская форма, одежда для охранников, промотекстиль, постельное бельё, эко-сумки и аксессуары — пошив на заказ с нанесением логотипа.'
          : "Ishchi kiyimlar, tibbiy va oshpaz formasi, soqchilar kiyimi, promo tekstil, ko'rpa-to'shak, eko-sumkalar va aksessuarlar — logotip bilan buyurtmaga tikamiz."}
      </p>


      {/* Mobile category toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{ display: 'none', marginBottom: 12, padding: '10px 16px', background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600, width: '100%', textAlign: 'left' }}
        className="sidebar-toggle"
      >
        📋 {lang === 'ru' ? 'Категории' : 'Kategoriyalar'} {sidebarOpen ? '▲' : '▼'}
      </button>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0 }} className={`catalog-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
            {categories.map((cat: any) => {
              const isActive = activeCat === cat.id
              const isExpanded = expandedCat === cat.id
              const hasSubs = cat.children?.length > 0
              return (
                <div key={cat.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      onClick={() => { setActiveCat(isActive ? null : cat.id); setSidebarOpen(false); if (hasSubs && !isExpanded) toggleExpand(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: isActive ? '#FFF5F5' : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#FAFAFA' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                    >
                      <CatIcon name={cat.icon} size={18} color={isActive ? '#D32F2F' : '#666'} />
                      <span style={{ flex: 1, fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? '#D32F2F' : '#333' }}>
                        {lang === 'ru' ? cat.nameRu : cat.nameUz}
                      </span>
                      <span style={{ fontSize: 11, background: '#F0F0F0', color: '#999', padding: '2px 7px', borderRadius: 99 }}>{cat._count?.products || 0}</span>
                    </button>
                    {hasSubs && (
                      <button onClick={() => toggleExpand(cat.id)}
                        style={{ padding: '12px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: 10, transition: 'transform .2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >▼</button>
                    )}
                  </div>
                  {hasSubs && isExpanded && (
                    <div style={{ background: '#FAFAFA' }}>
                      {cat.children.map((sub: any) => {
                        const isSubActive = activeCat === sub.id
                        return (
                          <button key={sub.id}
                            onClick={() => { setActiveCat(isSubActive ? null : sub.id); setSidebarOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px 9px 42px', background: isSubActive ? '#FFF5F5' : 'transparent', border: 'none', borderTop: '1px solid #F0F0F0', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                            onMouseEnter={e => { if (!isSubActive) e.currentTarget.style.background = '#F5F5F5' }}
                            onMouseLeave={e => { if (!isSubActive) e.currentTarget.style.background = 'transparent' }}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: isSubActive ? '#D32F2F' : '#CCC', flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: 13, fontWeight: isSubActive ? 600 : 400, color: isSubActive ? '#D32F2F' : '#555' }}>
                              {lang === 'ru' ? sub.nameRu : sub.nameUz}
                            </span>
                            <span style={{ fontSize: 10, background: '#EFEFEF', color: '#AAA', padding: '1px 6px', borderRadius: 99 }}>{sub._count?.products || 0}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {(!activeCat && !searchParams.get('categoryId') && !searchParams.get('search')) ? (
            /* Katalog ochilganda — kategoriyalar ro'yxati (mahsulotsiz) */
            <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {categories.filter((c: any) => !c.parentId).map((cat: any) => (
                <button key={cat.id} onClick={() => { setActiveCat(cat.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{ cursor: 'pointer', background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '24px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D32F2F'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CatIcon name={cat.icon} size={26} color="#D32F2F" />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{lang === 'ru' ? cat.nameRu : cat.nameUz}</span>
                  <span style={{ fontSize: 11, color: '#999' }}>{cat._count?.products ?? 0} {lang === 'ru' ? 'тов.' : 'ta'}</span>
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
              ART PRINT — производство спецодежды и униформы в Узбекистане. Шьём на заказ <b>рабочую одежду</b>, летнюю и зимнюю,
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
              ART PRINT — O'zbekistonda maxsus kiyim va uniforma ishlab chiqarish. Buyurtmaga <b>ishchi kiyimlar</b> (yozgi va qishki),
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
