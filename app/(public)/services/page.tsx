'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [lang, setLang] = useState<'ru' | 'uz'>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as 'ru' | 'uz' | null
    if (saved) setLang(saved)
    const onLangChange = () => {
      const l = localStorage.getItem('lang') as 'ru' | 'uz' | null
      if (l) setLang(l)
    }
    window.addEventListener('langchange', onLangChange)
    fetch('/api/nav-services').then(r => r.json()).then(setServices).catch(() => {})
    return () => window.removeEventListener('langchange', onLangChange)
  }, [])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 20px 80px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111', marginBottom: 8, letterSpacing: -0.5 }}>
        {lang === 'ru' ? 'Услуги' : 'Xizmatlar'}
      </h1>
      <p style={{ color: '#777', fontSize: 15, marginBottom: 40 }}>
        {lang === 'ru'
          ? 'Полный спектр услуг по производству спецодежды и текстиля'
          : "Maxsus kiyim va to'qimachilik ishlab chiqarish bo'yicha to'liq xizmatlar"}
      </p>

      {services.length === 0 ? (
        <p style={{ color: '#aaa', textAlign: 'center', padding: '60px 0' }}>
          {lang === 'ru' ? 'Услуги не найдены' : 'Xizmatlar topilmadi'}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {services.map((s: any) => (
            <Link
              key={s.id}
              href={`/xizmatlar/${s.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1.5px solid #eee',
                  borderRadius: 14,
                  padding: '28px 24px',
                  transition: 'all .2s',
                  cursor: 'pointer',
                  height: '100%',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#D32F2F'
                  el.style.boxShadow = '0 8px 32px rgba(211,47,47,0.12)'
                  el.style.transform = 'translateY(-4px)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = '#eee'
                  el.style.boxShadow = 'none'
                  el.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: '#FFF0F0', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 16
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
                    <line x1="7" y1="7" x2="7.01" y2="7"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 8, lineHeight: 1.3 }}>
                  {lang === 'ru' ? s.nameRu : (s.nameUz || s.nameRu)}
                </h3>
                {s.products?.length > 0 && (
                  <p style={{ fontSize: 13, color: '#999' }}>
                    {s.products.length} {lang === 'ru' ? 'товаров' : 'mahsulot'}
                  </p>
                )}
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, color: '#D32F2F', fontSize: 13, fontWeight: 600 }}>
                  {lang === 'ru' ? 'Подробнее' : "Batafsil"}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
