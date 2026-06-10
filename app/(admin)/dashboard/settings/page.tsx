'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function Field({ label, hint, children }: { label: string, hint?: string, children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#444', display: 'block', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 12, color: '#aaa', marginTop: 5 }}>{hint}</p>}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '12px 14px', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s', fontFamily: 'inherit' }

export default function SettingsPage() {
  const [form, setForm] = useState({ telegram: '', email: '', phone: '', address: '', mapLat: '', mapLng: '', aboutRu: '', aboutUz: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d?.id) setForm({ telegram: d.telegram || '', email: d.email || '', phone: d.phone || '', address: d.address || '', mapLat: d.mapLat || '', mapLng: d.mapLng || '', aboutRu: d.aboutRu || '', aboutUz: d.aboutUz || '' })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) toast.success('Muvaffaqiyatli saqlandi ✓')
    else toast.error('Xatolik yuz berdi')
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [key]: e.target.value }))
  const focusBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#D32F2F')
  const blurBorder = (e: React.FocusEvent<any>) => (e.target.style.borderColor = '#E8E8E8')

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>Yuklanmoqda...</div>

  return (
    <div style={{ maxWidth: 680 }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Contact */}
        <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 16, padding: '20px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            📞 Kontakt ma'lumotlari
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Telegram" hint="Misol: https://t.me/artprint_uz yoki @artprint_uz">
              <input style={inputStyle} value={form.telegram} onChange={set('telegram')} placeholder="https://t.me/artprint_uz" onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
            <Field label="Email">
              <input style={inputStyle} type="email" value={form.email} onChange={set('email')} placeholder="info@artprint.uz" onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
            <Field label="Telefon raqami">
              <input style={inputStyle} value={form.phone} onChange={set('phone')} placeholder="+998 77 741 66 88" onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
          </div>
        </div>

        {/* Address & Map */}
        <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 16, padding: '20px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>📍 Manzil va xarita</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="To'liq manzil">
              <input style={inputStyle} value={form.address} onChange={set('address')} placeholder="Toshkent, Yakkasaroy tumani, Nukus ko'chasi 12" onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Kenglik (Lat)" hint="Misol: 41.2995">
                <input style={inputStyle} value={form.mapLat} onChange={set('mapLat')} placeholder="41.2995" onFocus={focusBorder} onBlur={blurBorder} />
              </Field>
              <Field label="Uzunlik (Lng)" hint="Misol: 69.2401">
                <input style={inputStyle} value={form.mapLng} onChange={set('mapLng')} placeholder="69.2401" onFocus={focusBorder} onBlur={blurBorder} />
              </Field>
            </div>
            {form.mapLat && form.mapLng && (
              <div style={{ borderRadius: 10, overflow: 'hidden', height: 180 }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(form.mapLng)-0.01}%2C${parseFloat(form.mapLat)-0.01}%2C${parseFloat(form.mapLng)+0.01}%2C${parseFloat(form.mapLat)+0.01}&layer=mapnik&marker=${form.mapLat}%2C${form.mapLng}`}
                  width="100%" height="180" style={{ border: 0, display: 'block' }} title="preview" />
              </div>
            )}
          </div>
        </div>

        {/* About */}
        <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 16, padding: '20px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>📝 "Biz haqimizda" matni</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Rus tilida">
              <textarea style={{ ...inputStyle, resize: 'none' } as any} rows={4} value={form.aboutRu} onChange={set('aboutRu')} placeholder="Компания ART PRINT..." onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
            <Field label="O'zbek tilida">
              <textarea style={{ ...inputStyle, resize: 'none' } as any} rows={4} value={form.aboutUz} onChange={set('aboutUz')} placeholder="ART PRINT kompaniyasi..." onFocus={focusBorder} onBlur={blurBorder} />
            </Field>
          </div>
        </div>

        <button type="submit" disabled={saving}
          style={{ width: '100%', padding: '16px', border: 'none', borderRadius: 12, background: saving ? '#ccc' : '#D32F2F', color: '#fff', fontSize: 16, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', transition: 'background .2s', boxShadow: '0 4px 16px rgba(211,47,47,0.2)' }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.background = '#B71C1C' }}
          onMouseLeave={e => { if (!saving) e.currentTarget.style.background = '#D32F2F' }}
        >
          {saving ? 'Saqlanmoqda...' : '✓ Saqlash'}
        </button>
      </form>
    </div>
  )
}
