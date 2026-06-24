'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer, Package, Briefcase, Tag, Layers, Scissors, ShoppingBag } from 'lucide-react'

const CAT_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  ShieldCheck, Footprints, Hand, Stethoscope, GraduationCap, Shirt, BedDouble, TowelRack, Gift, Printer, Briefcase, Tag, Layers, Scissors, ShoppingBag,
}
function CatIcon({ name, color }: { name?: string; color?: string }) {
  const C = name ? CAT_ICONS[name] : null
  return C ? <C size={20} color={color} /> : <Package size={20} color={color} />
}

export default function Header() {
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [navServices, setNavServices] = useState<any[]>([])
  const [settings, setSettings] = useState<any>({})
  const router = useRouter()
  const pathname = usePathname()
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
          <div className="topbar-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, height: 40 }}>
            {settings.telegram && (
              <a href={settings.telegram} target="_blank" rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', color: '#229ED9', textDecoration: 'none', transition: 'opacity .2s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/></svg>
              </a>
            )}
            {/* Instagram (havola keyin ulanadi) */}
            <a href="#" aria-label="Instagram"
              style={{ display: 'flex', alignItems: 'center', color: '#E1306C', textDecoration: 'none', transition: 'opacity .2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            {/* WhatsApp (havola keyin ulanadi) */}
            <a href="#" aria-label="WhatsApp"
              style={{ display: 'flex', alignItems: 'center', color: '#25D366', textDecoration: 'none', transition: 'opacity .2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.04c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.69-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z"/></svg>
            </a>
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
          </div>
        </div>

        {/* Main nav */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.svg" alt="Art Print Textile" style={{ height: 62, width: 'auto', display: 'block' }} />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="header-search" style={{ flex: 1, maxWidth: 600, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #E0E0E0', borderRadius: 99, overflow: 'hidden', transition: 'border-color .2s', background: '#FAFAFA' }}>
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
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 99, border: '1.5px solid #E0E0E0', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', transition: 'all .2s', flexShrink: 0 }}
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
        <div style={{ borderTop: '1px solid #F5F5F5', position: 'relative' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', height: 48 }}>

            {/* Catalog */}
            <Link href="/catalog"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D32F2F', color: '#fff', padding: '10px 18px', borderRadius: 99, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background .2s', textDecoration: 'none', marginRight: 8 }}
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
                  style={{ padding: '6px 14px', fontSize: 14, color: '#555', borderRadius: 99, transition: 'all .15s', textDecoration: 'none', fontWeight: 500 }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '' }}
                >
                  {lang === 'ru' ? item.ru : item.uz}
                </Link>
              ))}

              {/* Services link */}
              <Link href="/services"
                style={{ padding: '6px 14px', fontSize: 14, color: '#555', borderRadius: 8, transition: 'all .15s', textDecoration: 'none', fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '' }}
              >
                {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
              </Link>
            </nav>
          </div>

        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)} />
          <div style={{ width: 300, background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button onClick={() => setMobileOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Katalog kategoriyalari (URSUS uslubida) */}
                <div style={{ padding: '4px 8px 8px', fontSize: 13, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {lang === 'ru' ? 'Каталог' : 'Katalog'}
                </div>
                {categories.filter((c: any) => !c.parentId).map((cat: any) => (
                  <Link key={cat.id} href={`/catalog?categoryId=${cat.id}`} onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 8px', fontSize: 15.5, color: '#333', fontWeight: 600, borderBottom: '1px solid #F5F5F5', textDecoration: 'none' }}
                  >
                    <CatIcon name={cat.icon} color="#D32F2F" />
                    <span>{lang === 'ru' ? cat.nameRu : cat.nameUz}</span>
                  </Link>
                ))}
                <div style={{ padding: '16px 8px 8px', fontSize: 13, color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {lang === 'ru' ? 'Информация' : 'Maʼlumot'}
                </div>
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
              {settings.phone && <a href={`tel:${settings.phone}`} style={{ display: 'block', textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#D32F2F', textDecoration: 'none' }}>{settings.phone}</a>}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav" style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, background: '#fff', borderTop: '1.5px solid #F0F0F0', boxShadow: '0 -4px 24px rgba(0,0,0,0.07)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {[
          { href: '/', label: lang === 'ru' ? 'Главная' : 'Bosh sahifa', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { href: '/catalog', label: lang === 'ru' ? 'Каталог' : 'Katalog', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
          { href: '/services', label: lang === 'ru' ? 'Услуги' : 'Xizmatlar', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
          { href: '/contacts', label: lang === 'ru' ? 'Контакты' : 'Kontaktlar', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.13 1 .36 1.97.71 2.9a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.17-1.18a2 2 0 012.11-.45c.93.35 1.9.58 2.9.71A2 2 0 0122 16.92z"/></svg> },
        ].map(item => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '8px 4px 10px', gap: 3, color: active ? '#D32F2F' : '#999', textDecoration: 'none', fontSize: 10, fontWeight: 600, transition: 'color .2s', position: 'relative' }}
            >
              {active && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 32, height: 3, borderRadius: '0 0 3px 3px', background: '#D32F2F' }} />}
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .header-search { display: none !important; }
          .header-lang { display: none !important; }
          nav { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
          body { padding-bottom: calc(64px + env(safe-area-inset-bottom)); }
        }
        @media (max-width: 480px) {
          .header-topbar .topbar-inner { padding: 0 12px !important; gap: 12px !important; height: 36px !important; }
        }
      `}</style>
    </>
  )
}
