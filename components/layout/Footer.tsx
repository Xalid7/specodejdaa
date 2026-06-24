'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [settings, setSettings] = useState<any>({})
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => {
      const l = localStorage.getItem('lang') as 'ru' | 'uz' | null
      if (l) setLang(l)
    }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  const t = {
    desc: {
      ru: 'Производство спецодежды, униформы и брендированной продукции в Узбекистане',
      uz: "O'zbekistonda maxsus kiyim, uniform va brendlangan mahsulotlar ishlab chiqarish",
    },
    catalog: { ru: 'Каталог', uz: 'Katalog' },
    allCatalog: { ru: 'Весь каталог', uz: 'Barcha mahsulotlar' },
    services: { ru: 'Услуги', uz: 'Xizmatlar' },
    company: { ru: 'Компания', uz: 'Kompaniya' },
    about: { ru: 'О нас', uz: 'Biz haqimizda' },
    contacts: { ru: 'Контакты', uz: 'Kontaktlar' },
    address: { ru: 'Наш адрес', uz: 'Bizning manzil' },
    rights: { ru: 'Все права защищены.', uz: 'Barcha huquqlar himoyalangan.' },
  }

  return (
    <footer style={{ background: '#1A1A1A', color: '#ccc', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 16px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <img src="/logo.svg" alt="Art Print Textile" style={{ height: 56, width: 'auto', display: 'block' }} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#888', marginBottom: 20, maxWidth: 220 }}>
              {t.desc[lang]}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {settings.telegram && (
                <a href={settings.telegram} target="_blank" rel="noreferrer"
                  style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0088cc'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#aaa' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/></svg>
                </a>
              )}
              {/* Instagram (havola keyin ulanadi) */}
              <a href="#" aria-label="Instagram"
                style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all .2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#aaa' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              </a>
              {/* WhatsApp (havola keyin ulanadi) */}
              <a href="#" aria-label="WhatsApp"
                style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all .2s', textDecoration: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#aaa' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.04c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.69-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z"/></svg>
              </a>
              {settings.phone && (
                <a href={`tel:${settings.phone}`}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#aaa' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 0h3a2 2 0 012 1.72c.13 1 .36 1.97.71 2.9a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.17-1.18a2 2 0 012.11-.45c.93.35 1.9.58 2.9.71A2 2 0 0122 16.92z"/></svg>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`}
                  style={{ width: 38, height: 38, borderRadius: '50%', background: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', transition: 'all .2s', textDecoration: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#D32F2F'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#2A2A2A'; e.currentTarget.style.color = '#aaa' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 20 }}>{t.catalog[lang]}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/catalog', label: t.allCatalog[lang] },
                { href: '/services', label: t.services[lang] },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  style={{ color: '#888', fontSize: 14, textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 20 }}>{t.company[lang]}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { href: '/about', label: t.about[lang] },
                { href: '/contacts', label: t.contacts[lang] },
              ].map(link => (
                <Link key={link.href} href={link.href}
                  style={{ color: '#888', fontSize: 14, textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#888')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Map */}
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 20 }}>{t.address[lang]}</h3>
            {settings.mapLat && settings.mapLng ? (
              <div style={{ borderRadius: 10, overflow: 'hidden', height: 140 }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.mapLng)-0.008}%2C${parseFloat(settings.mapLat)-0.008}%2C${parseFloat(settings.mapLng)+0.008}%2C${parseFloat(settings.mapLat)+0.008}&layer=mapnik&marker=${settings.mapLat}%2C${settings.mapLng}`}
                  width="100%" height="140" style={{ border: 0, display: 'block' }}
                  title="map"
                />
              </div>
            ) : (
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{settings.address || ''}</p>
            )}
            {settings.phone && <p style={{ marginTop: 12, fontSize: 14, color: '#ccc', fontWeight: 600 }}>{settings.phone}</p>}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #2A2A2A', padding: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#555' }}>© {new Date().getFullYear()} ООО «ART PRINT AND TEXTILE». {t.rights[lang]}</p>
      </div>
    </footer>
  )
}
