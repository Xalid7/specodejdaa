'use client'
import { useEffect, useState } from 'react'

export default function TelegramFloat() {
  const [link, setLink] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(s => {
      if (s?.telegram) setLink(s.telegram)
    }).catch(() => {})
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!link) return null

  return (
    <>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        title="Telegram orqali bog'laning"
        style={{
          position: 'fixed',
          bottom: 88,
          right: 20,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2AABEE, #229ED9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(42,171,238,0.45)',
          zIndex: 150,
          textDecoration: 'none',
          transition: 'transform .2s, box-shadow .2s',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.5)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)'
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(42,171,238,0.6)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(42,171,238,0.45)'
        }}
        className="tg-float"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.03 9.57c-.15.666-.544.83-1.103.517l-3.053-2.248-1.47 1.417c-.163.163-.3.3-.614.3l.219-3.106 5.656-5.108c.245-.219-.054-.34-.381-.121L7.27 14.748l-2.978-.929c-.648-.2-.66-.648.135-.959l11.627-4.484c.54-.196 1.013.131.508.872z"/>
        </svg>
        <span className="tg-pulse" />
      </a>

      <style>{`
        .tg-float { transition: opacity .4s, transform .4s, box-shadow .2s !important; }
        .tg-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(42,171,238,0.6);
          animation: tgPulse 2.5s ease infinite;
        }
        @keyframes tgPulse {
          0%   { transform: scale(1);   opacity: .7; }
          70%  { transform: scale(1.5); opacity: 0;  }
          100% { transform: scale(1.5); opacity: 0;  }
        }
        @media (max-width: 768px) {
          .tg-float { bottom: 76px !important; right: 14px !important; width: 48px !important; height: 48px !important; }
        }
      `}</style>
    </>
  )
}
