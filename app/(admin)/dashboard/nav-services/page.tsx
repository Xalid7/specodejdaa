'use client'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function NavServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nameRu: '', nameUz: '' })
  const [uploading, setUploading] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [prodModal, setProdModal] = useState<string | null>(null)
  const [prodForm, setProdForm] = useState({ nameRu: '', nameUz: '', descRu: '', imageUrl: '' })
  const [prodUploading, setProdUploading] = useState(false)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const prodFileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = () =>
    fetch('/api/nav-services').then(r => r.json()).then(setServices).catch(() => {})

  const handleUploadImage = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(id)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        await fetch(`/api/nav-services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: data.url }) })
        toast.success('Rasm yuklandi')
        fetchServices()
      }
    } catch { toast.error('Xatolik') }
    setUploading(null); e.target.value = ''
  }

  const handleRemoveImage = async (id: string) => {
    await fetch(`/api/nav-services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl: null }) })
    toast.success("Rasm o'chirildi"); fetchServices()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/nav-services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast.success("Qo'shildi"); setModal(false); setForm({ nameRu: '', nameUz: '' }); fetchServices() }
    else toast.error('Xatolik')
  }

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirishga ishonchingiz komilmi?")) return
    await fetch(`/api/nav-services/${id}`, { method: 'DELETE' })
    toast.success("O'chirildi"); fetchServices()
  }

  const handleProdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setProdUploading(true)
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) setProdForm(f => ({ ...f, imageUrl: data.url }))
    setProdUploading(false); e.target.value = ''
  }

  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!prodModal) return
    const res = await fetch(`/api/nav-services/${prodModal}/products`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prodForm)
    })
    if (res.ok) { toast.success("Mahsulot qo'shildi"); setProdModal(null); setProdForm({ nameRu: '', nameUz: '', descRu: '', imageUrl: '' }); fetchServices() }
    else toast.error('Xatolik')
  }

  const handleProdDelete = async (serviceId: string, pid: string) => {
    if (!confirm("O'chirishga ishonchingiz komilmi?")) return
    await fetch(`/api/nav-services/${serviceId}/products/${pid}`, { method: 'DELETE' })
    toast.success("O'chirildi"); fetchServices()
  }

  const inp: React.CSSProperties = { width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }
  const gradients = ['#D32F2F','#1565C0','#2E7D32','#E65100','#6A1B9A','#00838F','#558B2F','#AD1457']

  return (
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#999' }}>Xizmatlar va ularning mahsulotlarini boshqaring</p>
        <button onClick={() => setModal(true)}
          style={{ background: '#D32F2F', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + Xizmat qo'shish
        </button>
      </div>

      {services.length === 0 ? (
        <div style={{ background: '#fff', border: '2px dashed #E0E0E0', borderRadius: 16, padding: '60px 24px', textAlign: 'center', color: '#bbb' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
          <p style={{ fontSize: 15, color: '#999' }}>Xizmatlar yo'q</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {services.map((s: any, i: number) => (
            <div key={s.id} style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
              {/* Service header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <input ref={el => { fileInputRefs.current[s.id] = el }} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleUploadImage(s.id, e)} />
                <div onClick={() => !uploading && fileInputRefs.current[s.id]?.click()}
                  style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', background: gradients[i % gradients.length] + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {s.imageUrl
                    ? <img src={s.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 22, opacity: 0.5 }}>📷</span>}
                  {uploading === s.id && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>...</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>{s.nameRu}</p>
                  <p style={{ fontSize: 12, color: '#aaa' }}>{s.products?.length || 0} ta mahsulot</p>
                </div>
                <button onClick={() => setProdModal(s.id)}
                  style={{ background: '#F5F5F5', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#333' }}>
                  + Mahsulot
                </button>
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, color: '#aaa', fontSize: 18, transition: 'transform .2s', transform: expanded === s.id ? 'rotate(180deg)' : 'none' }}>▾</button>
                {s.imageUrl && <button onClick={() => handleRemoveImage(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')} onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}>🗑</button>}
                <button onClick={() => handleDelete(s.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: 16, padding: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')} onMouseLeave={e => (e.currentTarget.style.color = '#ccc')}>✕</button>
              </div>

              {/* Products list */}
              {expanded === s.id && (
                <div style={{ borderTop: '1px solid #F5F5F5', padding: '12px 16px', background: '#FAFAFA' }}>
                  {(!s.products || s.products.length === 0) ? (
                    <p style={{ fontSize: 13, color: '#bbb', textAlign: 'center', padding: '16px 0' }}>Mahsulotlar yo'q — "+ Mahsulot" tugmasini bosing</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                      {s.products.map((p: any) => (
                        <div key={p.id} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ aspectRatio: '4/3', background: '#F8F8F8', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 28, opacity: 0.3 }}>🖼</span>}
                          </div>
                          <div style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#111', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nameRu}</p>
                            <button onClick={() => handleProdDelete(s.id, p.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ddd', fontSize: 14, padding: '0 0 0 6px', flexShrink: 0 }}
                              onMouseEnter={e => (e.currentTarget.style.color = '#D32F2F')} onMouseLeave={e => (e.currentTarget.style.color = '#ddd')}>🗑</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add service modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 400, borderRadius: 20 }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Yangi xizmat</h2>
              <button onClick={() => setModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (RU) *</label>
                <input required style={inp} value={form.nameRu} onChange={e => setForm(f => ({ ...f, nameRu: e.target.value }))} placeholder="Шелкография" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (UZ)</label>
                <input style={inp} value={form.nameUz} onChange={e => setForm(f => ({ ...f, nameUz: e.target.value }))} placeholder="Шелкография" />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: 13, border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Bekor</button>
                <button type="submit" disabled={saving} style={{ flex: 2, padding: 13, border: 'none', borderRadius: 10, background: saving ? '#ccc' : '#D32F2F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  {saving ? 'Saqlanmoqda...' : "+ Qo'shish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add product modal */}
      {prodModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: 440, borderRadius: 20, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>Mahsulot qo'shish</h2>
              <button onClick={() => { setProdModal(null); setProdForm({ nameRu: '', nameUz: '', descRu: '', imageUrl: '' }) }}
                style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>
            <form onSubmit={handleProdSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Image upload */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Rasm</label>
                <input ref={prodFileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProdUpload} />
                <div onClick={() => prodFileRef.current?.click()}
                  style={{ border: '2px dashed #E0E0E0', borderRadius: 10, padding: 16, textAlign: 'center', cursor: 'pointer', background: '#FAFAFA' }}>
                  {prodForm.imageUrl
                    ? <img src={prodForm.imageUrl} alt="" style={{ height: 80, objectFit: 'contain', borderRadius: 8 }} />
                    : <div>
                        <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                        <p style={{ fontSize: 12, color: '#aaa' }}>{prodUploading ? 'Yuklanmoqda...' : 'Rasm tanlash'}</p>
                      </div>
                  }
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (RU) *</label>
                <input required style={inp} value={prodForm.nameRu} onChange={e => setProdForm(f => ({ ...f, nameRu: e.target.value }))} placeholder="Шелкография на футболке" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (UZ)</label>
                <input style={inp} value={prodForm.nameUz} onChange={e => setProdForm(f => ({ ...f, nameUz: e.target.value }))} placeholder="Futbolkaga bosma" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Tavsif (RU)</label>
                <textarea style={{ ...inp, resize: 'vertical', minHeight: 70 }} value={prodForm.descRu} onChange={e => setProdForm(f => ({ ...f, descRu: e.target.value }))} placeholder="Tavsif..." />
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => { setProdModal(null); setProdForm({ nameRu: '', nameUz: '', descRu: '', imageUrl: '' }) }}
                  style={{ flex: 1, padding: 13, border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Bekor</button>
                <button type="submit" style={{ flex: 2, padding: 13, border: 'none', borderRadius: 10, background: '#D32F2F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                  + Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
