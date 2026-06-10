'use client'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function NavServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nameRu: '', nameUz: '' })
  const [uploading, setUploading] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => { fetchServices() }, [])
  const fetchServices = () => fetch('/api/nav-services').then(r => r.json()).then(setServices).catch(() => {})

  const handleUploadImage = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(id)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        await fetch(`/api/nav-services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: data.url }) })
        toast.success('Rasm yuklandi ✓')
        fetchServices()
      } else {
        toast.error(`Xatolik: ${data.error || 'Noma\'lum xato'}`)
      }
    } catch (err: any) {
      toast.error(`Xatolik: ${err.message}`)
    }
    setUploading(null)
    e.target.value = ''
  }

  const handleRemoveImage = async (id: string) => {
    await fetch(`/api/nav-services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: null }) })
    toast.success('Rasm o\'chirildi')
    fetchServices()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/nav-services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast.success('Qo\'shildi'); setModal(false); setForm({ nameRu: '', nameUz: '' }); fetchServices() }
    else toast.error('Xatolik')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('O\'chirishga ishonchingiz komilmi?')) return
    const res = await fetch(`/api/nav-services/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('O\'chirildi'); fetchServices() }
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  const gradients = ['#D32F2F','#1565C0','#2E7D32','#E65100','#6A1B9A','#00838F','#558B2F','#AD1457']

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <p style={{ fontSize: 13, color: '#999', marginTop: 4 }}>Har bir xizmat uchun rasm yuklab, mega-menyu kartochkasini sozlang</p>
        </div>
        <button onClick={() => setModal(true)}
          style={{ background: '#D32F2F', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
        >+ Xizmat qo'shish</button>
      </div>

      {services.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E0E0E0', borderRadius: 16, padding: '60px 24px', textAlign: 'center', color: '#bbb' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
          <p style={{ fontSize: 15, color: '#999' }}>Xizmatlar yo'q</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {services.map((s: any, i: number) => (
            <div key={s.id} style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
              {/* Hidden file input */}
              <input
                ref={el => { fileInputRefs.current[s.id] = el }}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleUploadImage(s.id, e)}
              />

              {/* Image area */}
              <div
                onClick={() => !uploading && fileInputRefs.current[s.id]?.click()}
                style={{ aspectRatio: '4/3', position: 'relative', background: gradients[i % gradients.length] + '22', cursor: uploading === s.id ? 'wait' : 'pointer' }}
              >
                {s.imageUrl ? (
                  <>
                    <img src={s.imageUrl} alt={s.nameRu} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background .2s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                    >
                      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: '#fff', fontSize: 11, fontWeight: 700, opacity: 0, transition: 'opacity .2s', textAlign: 'center', pointerEvents: 'none' }}
                        className="img-overlay-text"
                      >✏️ Almashtirish</div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); handleRemoveImage(s.id) }}
                      style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.65)', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                    >×</button>
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ fontSize: 30, opacity: 0.4 }}>📷</span>
                    <span style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>
                      {uploading === s.id ? '⏳ Yuklanmoqda...' : 'Rasm yuklash'}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.nameRu}</p>
                  <p style={{ fontSize: 11, color: '#aaa' }}>{s.nameUz}</p>
                </div>
                <button onClick={() => handleDelete(s.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, padding: 4, flexShrink: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}
                >🗑</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 400, borderRadius: 20 }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Yangi xizmat</h2>
              <button onClick={() => setModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18, color: '#555' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (RU) *</label>
                <input required style={inputStyle} value={form.nameRu} onChange={e => setForm(f => ({ ...f, nameRu: e.target.value }))} placeholder="Вышивка" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (UZ)</label>
                <input style={inputStyle} value={form.nameUz} onChange={e => setForm(f => ({ ...f, nameUz: e.target.value }))} placeholder="Kashtachilik" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '13px', border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Bekor</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: saving ? '#ccc' : '#D32F2F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {saving ? 'Saqlanmoqda...' : '+ Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
