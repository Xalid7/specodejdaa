'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ imageUrl: '', titleRu: '', titleUz: '', subtitleRu: '', subtitleUz: '', ctaText: '', ctaLink: '' })

  useEffect(() => { fetchBanners() }, [])
  const fetchBanners = () => fetch('/api/banners').then(r => r.json()).then(setBanners).catch(() => {})

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setForm(f => ({ ...f, imageUrl: data.url }))
    setUploading(false)
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.imageUrl) { toast.error('Rasm yuklang'); return }
    setSaving(true)
    const res = await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast.success('Banner qo\'shildi ✓'); setModal(false); setForm({ imageUrl: '', titleRu: '', titleUz: '', subtitleRu: '', subtitleUz: '', ctaText: '', ctaLink: '' }); fetchBanners() }
    else toast.error('Xatolik')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bannerni o\'chirmoqchimisiz?')) return
    const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('O\'chirildi'); fetchBanners() }
  }

  const inputStyle: React.CSSProperties = { width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={() => setModal(true)}
          style={{ background: '#D32F2F', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background .2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
        >
          + Banner qo'shish
        </button>
      </div>

      {banners.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E0E0E0', borderRadius: 16, padding: '64px 24px', textAlign: 'center', color: '#bbb' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🖼️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#999', marginBottom: 8 }}>Hozircha banner yo'q</p>
          <p style={{ fontSize: 14, marginBottom: 24 }}>Bosh sahifadagi slider uchun banner qo'shing</p>
          <button onClick={() => setModal(true)} style={{ background: '#D32F2F', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            + Birinchi bannerni qo'shish
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {banners.map((b: any, i: number) => (
            <div key={b.id} style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden', transition: 'box-shadow .2s' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ position: 'relative', aspectRatio: '16/9', background: '#F0F0F0' }}>
                <img src={b.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
                <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>#{i + 1}</span>
                <button onClick={() => handleDelete(b.id)}
                  style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#D32F2F', color: '#fff', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
                >×</button>
              </div>
              <div style={{ padding: '14px' }}>
                {b.titleRu ? (
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>{b.titleRu}</p>
                ) : (
                  <p style={{ fontSize: 14, color: '#bbb', fontStyle: 'italic' }}>Sarlavha yo'q</p>
                )}
                {b.subtitleRu && <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{b.subtitleRu}</p>}
                {b.ctaText && (
                  <span style={{ display: 'inline-block', background: '#FFEBEE', color: '#D32F2F', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>
                    CTA: {b.ctaText}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} className="modal-wrap">
          <div style={{ background: '#fff', width: '100%', maxWidth: 520, borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto' }} className="modal-inner">
            <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Yangi banner qo'shish</h2>
              <button onClick={() => setModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18, color: '#555' }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Upload */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 8 }}>Rasm * (16:9 tavsiya etiladi)</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 14, border: '2px dashed #E0E0E0', borderRadius: 12, padding: '20px', cursor: 'pointer', transition: 'border-color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#D32F2F')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
                >
                  <span style={{ fontSize: 32 }}>📸</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}</p>
                    <p style={{ fontSize: 12, color: '#aaa' }}>JPG, PNG, WEBP</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
                {form.imageUrl && (
                  <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', aspectRatio: '16/9' }}>
                    <img src={form.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Sarlavha (RU)</label>
                  <input style={inputStyle} value={form.titleRu} onChange={e => setForm(f => ({ ...f, titleRu: e.target.value }))} placeholder="Новая коллекция" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Sarlavha (UZ)</label>
                  <input style={inputStyle} value={form.titleUz} onChange={e => setForm(f => ({ ...f, titleUz: e.target.value }))} placeholder="Yangi kolleksiya" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tavsif (RU)</label>
                  <input style={inputStyle} value={form.subtitleRu} onChange={e => setForm(f => ({ ...f, subtitleRu: e.target.value }))} placeholder="Yozgi kolleksiya" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tavsif (UZ)</label>
                  <input style={inputStyle} value={form.subtitleUz} onChange={e => setForm(f => ({ ...f, subtitleUz: e.target.value }))} placeholder="Yozgi kolleksiya" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tugma matni</label>
                  <input style={inputStyle} value={form.ctaText} onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} placeholder="Ko'proq" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tugma havolasi</label>
                  <input style={inputStyle} value={form.ctaLink} onChange={e => setForm(f => ({ ...f, ctaLink: e.target.value }))} placeholder="/catalog" onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '13px', border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Bekor</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: saving ? '#ccc' : '#D32F2F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {saving ? 'Yuklanmoqda...' : '+ Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
          <style>{`@media(min-width:600px){.modal-wrap{align-items:center!important;padding:16px!important}.modal-inner{border-radius:20px!important}}`}</style>
        </div>
      )}
    </div>
  )
}
