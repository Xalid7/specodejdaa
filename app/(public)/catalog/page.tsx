'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function CatalogContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeCat, setActiveCat] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    { key: 'all', ru: 'ВЕСЬ КАТАЛОГ', uz: 'BARCHA' },
    { key: 'new', ru: 'НОВИНКИ', uz: 'YANGILAR' },
    { key: 'collection', ru: 'ПОДБОРКИ', uz: 'TANLOVLAR' },
    { key: 'holiday', ru: 'К ПРАЗДНИКАМ', uz: 'BAYRAMGA' },
  ]

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>

      {/* Filter tabs */}
      <div style={{ background: '#D32F2F', borderRadius: 12, marginBottom: 24, overflowX: 'auto', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: 6, gap: 4, minWidth: 'max-content' }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setActiveFilter(f.key)}
              style={{ padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, letterSpacing: 0.3, transition: 'all .2s', whiteSpace: 'nowrap', background: activeFilter === f.key ? '#fff' : 'transparent', color: activeFilter === f.key ? '#D32F2F' : 'rgba(255,255,255,0.85)' }}
            >
              {lang === 'ru' ? f.ru : f.uz}
            </button>
          ))}
        </div>
      </div>

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
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F5F5F5' }}>
              <button onClick={() => { setActiveCat(null); setSidebarOpen(false) }}
                style={{ fontSize: 13, fontWeight: 700, color: activeCat === null ? '#D32F2F' : '#555', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span>📦</span> {lang === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
              </button>
            </div>
            {categories.map((cat: any) => (
              <button key={cat.id} onClick={() => { setActiveCat(activeCat === cat.id ? null : cat.id); setSidebarOpen(false) }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: activeCat === cat.id ? '#FFF5F5' : 'transparent', border: 'none', borderBottom: '1px solid #FAFAFA', cursor: 'pointer', textAlign: 'left', transition: 'background .15s' }}
                onMouseEnter={e => { if (activeCat !== cat.id) e.currentTarget.style.background = '#FAFAFA' }}
                onMouseLeave={e => { if (activeCat !== cat.id) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 20 }}>{cat.icon || '📦'}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: activeCat === cat.id ? 700 : 500, color: activeCat === cat.id ? '#D32F2F' : '#333' }}>
                  {lang === 'ru' ? cat.nameRu : cat.nameUz}
                </span>
                <span style={{ fontSize: 11, background: '#F0F0F0', color: '#999', padding: '2px 7px', borderRadius: 99 }}>{cat._count?.products || 0}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
                {products.map((p: any) => {
                  const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
                  return (
                    <Link key={p.id} href={`/catalog/${p.slug}`}
                      style={{ textDecoration: 'none', background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', transition: 'all .2s', display: 'block' }}
                      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = '#E0E0E0' }}
                      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = '#F0F0F0' }}
                    >
                      <div style={{ aspectRatio: '1', background: '#fff', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {imgs[0] ? (
                          <img src={imgs[0]} alt={lang === 'ru' ? p.nameRu : p.nameUz} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#DDD' }}>📦</div>
                        )}
                        {(p.isNew || p.isCollection) && (
                          <span style={{ position: 'absolute', top: 8, left: 8, background: p.isNew ? '#D32F2F' : '#1565C0', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
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

      <style>{`
        @media (max-width: 768px) {
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
