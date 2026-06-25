'use client'
import { useState, useEffect } from 'react'

export default function ContactsPage() {
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => { const l = localStorage.getItem('lang') as 'ru'|'uz'|null; if (l) setLang(l) }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  const t = {
    ru: {
      office: 'ОФИС',
      hours: '09:00 до 18:00',
      days: 'Понедельник — Пятница',
      weekend: 'Сб, Вс — выходные',
      mapLink: 'Открыть в Яндекс Картах',
      directions: 'КАК ДОБРАТЬСЯ',
      directionsText: 'Метро «Яккасарай» или «Хамид Олимжон». Первый вагон из центра. Выйдя из метро, пройдите по ул. Нукус в сторону Яккасарайского района до дома 12. Офис ООО «ART PRINT AND TEXTILE» — в здании на первом этаже.',
      mapEmpty: 'Карта не настроена',
    },
    uz: {
      office: 'OFIS',
      hours: '09:00 dan 18:00 gacha',
      days: 'Dushanba — Juma',
      weekend: 'Shan, Yak — dam olish kunlari',
      mapLink: 'Yandex Xaritada ochish',
      directions: 'YO\'L TOPISH',
      directionsText: 'Metro «Yakkasaroy» yoki «Hamid Olimjon». Markazdan birinchi vagon. Metrodan chiqqach, Nukus ko\'chasi bo\'ylab Yakkasaroy tumaniga tomon 12-uyga yuring. ООО «ART PRINT AND TEXTILE» ofisi — birinchi qavatda.',
      mapEmpty: 'Xarita sozlanmagan',
    },
  }
  const tx = t[lang]

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="contacts-grid">
        {/* Info */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111', marginBottom: 20, letterSpacing: 0.5 }}>{tx.office}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {settings?.address && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#555' }}>
                <span style={{ color: '#D32F2F', flexShrink: 0, marginTop: 2 }}>📍</span>
                <span style={{ fontSize: 14, lineHeight: 1.6 }}>{settings.address}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: '#555' }}>
              <span style={{ color: '#D32F2F', flexShrink: 0 }}>🕐</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{tx.hours}</p>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>{tx.days}</p>
                <p style={{ fontSize: 13, color: '#999' }}>{tx.weekend}</p>
              </div>
            </div>
            {settings?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#D32F2F', flexShrink: 0 }}>📞</span>
                <a href={`tel:${settings.phone}`} style={{ fontSize: 14, fontWeight: 600, color: '#333', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#333')}
                >{settings.phone}</a>
              </div>
            )}
            {settings?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ color: '#D32F2F', flexShrink: 0 }}>✉</span>
                <a href={`mailto:${settings.email}`} style={{ fontSize: 14, color: '#D32F2F', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                >{settings.email}</a>
              </div>
            )}
            {settings?.mapLat && settings?.mapLng && (
              <a href={`https://yandex.uz/maps/?ll=${settings.mapLng},${settings.mapLat}&z=16`}
                target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#D32F2F', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                🗺 {tx.mapLink}
              </a>
            )}
          </div>

        </div>

        {/* Map */}
        <div>
          {settings?.mapLat && settings?.mapLng ? (
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '1.5px solid #E0E0E0', height: 380 }}>
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(settings.mapLng)-0.01}%2C${parseFloat(settings.mapLat)-0.01}%2C${parseFloat(settings.mapLng)+0.01}%2C${parseFloat(settings.mapLat)+0.01}&layer=mapnik&marker=${settings.mapLat}%2C${settings.mapLng}`}
                width="100%" height="100%" style={{ border: 0, display: 'block' }}
                title="Office location"
              />
            </div>
          ) : (
            <div style={{ height: 320, background: '#F5F5F5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 14 }}>
              {tx.mapEmpty}
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:640px){.contacts-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  )
}
