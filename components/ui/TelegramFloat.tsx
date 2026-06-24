'use client'
import { useEffect, useState, type CSSProperties } from 'react'

// Havolalar keyin ulanadi (hozircha placeholder '#')
const INSTAGRAM_URL = '#'
const WHATSAPP_URL = '#'

export default function TelegramFloat() {
  const [tg, setTg] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => {
      if (s?.telegram) setTg(s.telegram)
    }).catch(() => {})
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const btn = (bg: string) => ({
    width: 54, height: 54, borderRadius: '50%', background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 18px rgba(0,0,0,0.22)', textDecoration: 'none',
    transition: 'transform .2s, box-shadow .2s',
  } as CSSProperties)

  return (
    <>
      <div
        className="social-float"
        style={{
          position: 'fixed', bottom: 88, right: 20, zIndex: 150,
          display: 'flex', flexDirection: 'column', gap: 12,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity .4s, transform .4s',
        }}
      >
        {/* WhatsApp */}
        <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp"
          style={btn('linear-gradient(135deg, #25D366, #128C7E)')}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.04c-.24.68-1.41 1.3-1.95 1.38-.5.07-1.12.1-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.33-.14-.19-1.17-1.56-1.17-2.97s.74-2.11 1-2.4c.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.21 1.36.28.14.44.12.6-.07.16-.19.69-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.76 1.88.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z"/></svg>
        </a>
        {/* Instagram */}
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"
          style={btn('linear-gradient(135deg, #833AB4, #FD1D1D, #FCB045)')}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/></svg>
        </a>
        {/* Telegram */}
        {tg && (
          <a href={tg} target="_blank" rel="noreferrer" aria-label="Telegram"
            style={btn('linear-gradient(135deg, #2AABEE, #229ED9)')}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/></svg>
          </a>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .social-float { bottom: 76px !important; right: 14px !important; gap: 10px !important; }
          .social-float a { width: 46px !important; height: 46px !important; }
        }
      `}</style>
    </>
  )
}
