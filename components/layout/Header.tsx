'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [navServices, setNavServices] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const router = useRouter()
  const svcRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
    fetch('/api/nav-services').then(r => r.json()).then(setNavServices).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  const toggleLang = () => {
    const next = lang === 'ru' ? 'uz' : 'ru'
    setLang(next)
    localStorage.setItem('lang', next)
    window.dispatchEvent(new Event('langchange'))
  }

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (svcRef.current && !svcRef.current.contains(e.target as Node)) setServicesOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) { router.push(`/catalog?search=${encodeURIComponent(search)}`); setMobileOpen(false) }
  }

  return (
    <>
      <header ref={headerRef} style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 1px 0 #eee' }}>

        {/* Top bar */}
        <div className="header-topbar" style={{ background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, height: 40 }}>
            {settings.telegram && (
              <a href={settings.telegram} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0088cc')}
                onMouseLeave={e => (e.currentTarget.style.color = '#666')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/></svg>
              </a>
            )}
            {settings.phone && (
              <a href={`tel:${settings.phone}`}
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 13, textDecoration: 'none', transition: 'color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')}
                onMouseLeave={e => (e.currentTarget.style.color = '#666')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.13 1 .36 1.97.71 2.9a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.17-1.18a2 2 0 012.11-.45c.93.35 1.9.58 2.9.71A2 2 0 0122 16.92z"/></svg>
                <span className="hidden sm:inline">{settings.phone}</span>
              </a>
            )}
            <Link href="/login"
              style={{ background: '#D32F2F', color: '#fff', fontSize: 13, fontWeight: 600, padding: '6px 16px', borderRadius: 6, textDecoration: 'none', transition: 'background .2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
              onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
            >
              Личный кабинет
            </Link>
          </div>
        </div>

        {/* Main nav */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, background: '#D32F2F', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 11, textAlign: 'center', lineHeight: 1.2 }}>Art<br/>Print</span>
            </div>
            <span className="logo-text" style={{ fontWeight: 800, fontSize: 20, color: '#212121', letterSpacing: -0.5 }}>ART PRINT</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="header-search" style={{ flex: 1, maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E0E0E0', borderRadius: 10, overflow: 'hidden', transition: 'border-color .2s' }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={lang === 'ru' ? 'Поиск по сайту...' : 'Qidiruv...'}
                style={{ flex: 1, padding: '10px 14px', fontSize: 14, border: 'none', outline: 'none', background: 'transparent', color: '#212121' }}
              />
              <button type="submit" style={{ padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
            </div>
          </form>

          {/* Lang toggle */}
          <button onClick={toggleLang} className="header-lang"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: '1.5px solid #E0E0E0', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', transition: 'all .2s', flexShrink: 0 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
            {lang.toUpperCase()}
          </button>

          {/* Hamburger (mobile) */}
          <button onClick={() => setMobileOpen(true)} style={{ display: 'none', padding: 8, border: 'none', background: 'none', cursor: 'pointer', flexShrink: 0, marginLeft: 'auto' }} className="mobile-menu-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>

        {/* Nav bar */}
        <div ref={svcRef} style={{ borderTop: '1px solid #F5F5F5', position: 'relative' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 48 }}>

            {/* Catalog */}
            <Link href="/catalog"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D32F2F', color: '#fff', padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background .2s', textDecoration: 'none', marginRight: 8 }}
              onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
              onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              {lang === 'ru' ? 'Каталог' : 'Katalog'}
            </Link>

            {/* Nav links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {[
                { href: '/about', ru: 'О нас', uz: 'Biz haqimizda' },
                { href: '/contacts', ru: 'Контакты', uz: 'Kontaktlar' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  style={{ padding: '6px 14px', fontSize: 14, color: '#555', borderRadius: 8, transition: 'all .15s', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '' }}
                >
                  {lang === 'ru' ? item.ru : item.uz}
                </Link>
              ))}

              {/* Services mega-menu trigger */}
              <div ref={svcRef} style={{ position: 'relative' }}>
                <button onClick={() => setServicesOpen(o => !o)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', fontSize: 14, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all .15s', background: servicesOpen ? '#FFF5F5' : 'none', color: servicesOpen ? '#D32F2F' : '#555' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5' }}
                  onMouseLeave={e => { if (!servicesOpen) { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '' } }}
                >
                  {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform .2s', transform: servicesOpen ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6"/></svg>
                </button>
              </div>
            </nav>
          </div>

          {/* Services Mega Menu — nav bar dan pastga tushadi */}
          {servicesOpen && navServices.length > 0 && (
            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 200, background: '#fff', borderTop: '2px solid #D32F2F', boxShadow: '0 12px 40px rgba(0,0,0,0.13)' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>
                    🎨 {lang === 'ru' ? 'Нанесение логотипа' : 'Logo bosish xizmatlari'}
                  </h3>
                  <button onClick={() => setServicesOpen(false)} style={{ border: 'none', background: '#F5F5F5', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 17, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
                  {navServices.map((s: any, i: number) => {
                    const gradients = ['linear-gradient(135deg,#D32F2F,#7B0000)','linear-gradient(135deg,#1565C0,#0D47A1)','linear-gradient(135deg,#2E7D32,#1B5E20)','linear-gradient(135deg,#E65100,#BF360C)','linear-gradient(135deg,#6A1B9A,#4A148C)','linear-gradient(135deg,#00838F,#006064)','linear-gradient(135deg,#558B2F,#33691E)','linear-gradient(135deg,#AD1457,#880E4F)']
                    return (
                      <Link key={s.id} href={`/xizmatlar/${s.slug}`} onClick={() => setServicesOpen(false)}
                        style={{ textDecoration: 'none', borderRadius: 12, overflow: 'hidden', display: 'block', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', transition: 'transform .2s, box-shadow .2s' }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)' }}
                      >
                        <div style={{ aspectRatio: '4/3', position: 'relative', background: gradients[i % gradients.length] }}>
                          {s.imageUrl
                            ? <img src={s.imageUrl} alt={s.nameRu} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, opacity: 0.7 }}>🎨</div>
                          }
                          {s.imageUrl && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />}
                        </div>
                        <div style={{ padding: '10px 12px', background: '#fff' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: '#111', lineHeight: 1.3 }}>{lang === 'ru' ? s.nameRu : s.nameUz}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
              <div style={{ position: 'fixed', inset: 0, zIndex: -1 }} onClick={() => setServicesOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 300, background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Menyu</span>
              <button onClick={() => setMobileOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link href="/about" onClick={() => setMobileOpen(false)}
                  style={{ padding: '16px 8px', fontSize: 16, color: '#333', fontWeight: 600, borderBottom: '1px solid #F5F5F5', textDecoration: 'none' }}
                >
                  {lang === 'ru' ? 'О нас' : 'Biz haqimizda'}
                </Link>
                <Link href="/contacts" onClick={() => setMobileOpen(false)}
                  style={{ padding: '16px 8px', fontSize: 16, color: '#333', fontWeight: 600, borderBottom: '1px solid #F5F5F5', textDecoration: 'none' }}
                >
                  {lang === 'ru' ? 'Контакты' : 'Kontaktlar'}
                </Link>
                <div style={{ padding: '12px 8px 8px', fontSize: 13, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
                </div>
                {navServices.map((s: any) => (
                  <Link key={s.id} href={`/xizmatlar/${s.slug}`} onClick={() => setMobileOpen(false)}
                    style={{ padding: '12px 8px', fontSize: 14, color: '#555', borderBottom: '1px solid #F9F9F9', textDecoration: 'none' }}
                  >
                    {lang === 'ru' ? s.nameRu : s.nameUz}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #F0F0F0' }}>
              {settings.phone && <a href={`tel:${settings.phone}`} style={{ display: 'block', textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#D32F2F', marginBottom: 12, textDecoration: 'none' }}>{settings.phone}</a>}
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', background: '#D32F2F', color: '#fff', padding: '12px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
                Личный кабинет
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .header-search { display: none !important; }
          .header-lang { display: none !important; }
          nav { display: none !important; }
          .logo-text { display: none !important; }
        }
        @media (max-width: 480px) {
          .header-topbar { display: none !important; }
        }
      `}</style>
    </>
  )
}
