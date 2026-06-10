'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function Modal({ title, onClose, children }: { title: string, onClose: () => void, children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0' }} className="modal-wrap">
      <div style={{ background: '#fff', width: '100%', maxWidth: 560, borderRadius: '20px 20px 0 0', maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }} className="modal-inner">
        <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
      <style>{`
        @media (min-width: 600px) {
          .modal-wrap { align-items: center !important; padding: 16px !important; }
          .modal-inner { border-radius: 20px !important; max-width: 560px; }
        }
      `}</style>
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>{children}</label>
}
function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color .2s', ...props.style }}
    onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
}
function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', transition: 'border-color .2s', fontFamily: 'inherit', ...props.style }}
    onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ nameRu: '', nameUz: '', descRu: '', descUz: '', categoryId: '', isNew: false, isCollection: false, isHoliday: false, images: [] as string[] })

  useEffect(() => { fetchAll() }, [])

  const fetchAll = () => {
    fetch('/api/products').then(r => r.json()).then(d => setProducts(Array.isArray(d) ? d : [])).catch(() => {})
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
  }

  const openAdd = () => {
    setEditing(null)
    setForm({ nameRu: '', nameUz: '', descRu: '', descUz: '', categoryId: '', isNew: false, isCollection: false, isHoliday: false, images: [] })
    setModal(true)
  }

  const openEdit = (p: any) => {
    setEditing(p)
    const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
    setForm({ nameRu: p.nameRu, nameUz: p.nameUz, descRu: p.descRu || '', descUz: p.descUz || '', categoryId: p.categoryId, isNew: p.isNew, isCollection: p.isCollection, isHoliday: p.isHoliday, images: imgs })
    setModal(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    const urls: string[] = []
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) urls.push(data.url)
    }
    setForm(f => ({ ...f, images: [...f.images, ...urls] }))
    setUploading(false)
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoryId) { toast.error('Kategoriyani tanlang'); return }
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/products/${editing.id}` : '/api/products'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast.success(editing ? 'Yangilandi ✓' : 'Qo\'shildi ✓'); setModal(false); fetchAll() }
    else toast.error('Xatolik yuz berdi')
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" ni o'chirmoqchimisiz?`)) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('O\'chirildi'); fetchAll() }
  }

  const filtered = products.filter(p =>
    (p.nameRu || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.nameUz || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#bbb', fontSize: 16 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Mahsulot qidirish..."
            style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 12px 11px 38px', fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' }}
            onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
          />
        </div>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D32F2F', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background .2s', flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
        >
          <span>+</span> Qo'shish
        </button>
      </div>

      {/* Count */}
      <p style={{ fontSize: 13, color: '#999', marginBottom: 14 }}>{filtered.length} ta mahsulot</p>

      {/* List */}
      <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#999', marginBottom: 6 }}>Mahsulotlar topilmadi</p>
            <p style={{ fontSize: 13 }}>Birinchi mahsulotingizni qo'shing</p>
            <button onClick={openAdd} style={{ marginTop: 16, background: '#D32F2F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Qo'shish
            </button>
          </div>
        ) : filtered.map((p: any, i: number) => {
          const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #F5F5F5' : 'none', transition: 'background .15s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 52, height: 52, borderRadius: 10, background: '#F0F0F0', overflow: 'hidden', flexShrink: 0 }}>
                {imgs[0] ? <img src={imgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📦</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 3 }}>{p.nameRu}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: '#aaa' }}>{p.category?.nameRu}</span>
                  {p.isNew && <span style={{ fontSize: 10, background: '#FFEBEE', color: '#D32F2F', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>NEW</span>}
                  {p.isCollection && <span style={{ fontSize: 10, background: '#E3F2FD', color: '#1565C0', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>HIT</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button onClick={() => openEdit(p)}
                  style={{ padding: '8px 14px', border: '1.5px solid #E8E8E8', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565C0'; e.currentTarget.style.color = '#1565C0' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#555' }}
                >
                  ✏️ Tahrirla
                </button>
                <button onClick={() => handleDelete(p.id, p.nameRu)}
                  style={{ padding: '8px 14px', border: '1.5px solid #E8E8E8', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', transition: 'all .15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D32F2F'; e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#555'; e.currentTarget.style.background = '#fff' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {modal && (
        <Modal title={editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Nom (RU) *</FieldLabel>
                <Input required value={form.nameRu} onChange={e => setForm(f => ({ ...f, nameRu: e.target.value }))} placeholder="Костюм рабочий" />
              </div>
              <div>
                <FieldLabel>Nom (UZ)</FieldLabel>
                <Input value={form.nameUz} onChange={e => setForm(f => ({ ...f, nameUz: e.target.value }))} placeholder="Ish kostyumi" />
              </div>
            </div>

            <div>
              <FieldLabel>Kategoriya *</FieldLabel>
              <select required value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
                <option value="">— Tanlang —</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.icon} {c.nameRu}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <FieldLabel>Tavsif (RU)</FieldLabel>
                <Textarea rows={3} value={form.descRu} onChange={e => setForm(f => ({ ...f, descRu: e.target.value }))} placeholder="Mahsulot haqida..." />
              </div>
              <div>
                <FieldLabel>Tavsif (UZ)</FieldLabel>
                <Textarea rows={3} value={form.descUz} onChange={e => setForm(f => ({ ...f, descUz: e.target.value }))} placeholder="Mahsulot haqida..." />
              </div>
            </div>

            {/* Image upload */}
            <div>
              <FieldLabel>Rasmlar</FieldLabel>
              <label style={{ display: 'flex', alignItems: 'center', gap: 12, border: '2px dashed #E0E0E0', borderRadius: 10, padding: '16px', cursor: 'pointer', transition: 'border-color .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#D32F2F')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E0E0E0')}
              >
                <span style={{ fontSize: 28 }}>📸</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{uploading ? 'Yuklanmoqda...' : 'Rasm yuklash'}</p>
                  <p style={{ fontSize: 12, color: '#aaa' }}>JPG, PNG, WEBP — bir nechta tanlasa bo'ladi</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
              {form.images.length > 0 && (
                <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '2px solid #F0F0F0' }} />
                      <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, j) => j !== i) }))}
                        style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#D32F2F', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flags */}
            <div>
              <FieldLabel>Belgilar</FieldLabel>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { key: 'isNew', label: '🆕 Yangi', color: '#FFEBEE', active: '#D32F2F' },
                  { key: 'isCollection', label: '🔥 HIT', color: '#E3F2FD', active: '#1565C0' },
                  { key: 'isHoliday', label: '🎉 Bayramga', color: '#FFF8E1', active: '#F57F17' },
                ].map(({ key, label, color, active }) => (
                  <button key={key} type="button"
                    onClick={() => setForm(f => ({ ...f, [key]: !(f as any)[key] }))}
                    style={{ padding: '8px 16px', borderRadius: 8, border: `2px solid ${(form as any)[key] ? active : '#E0E0E0'}`, background: (form as any)[key] ? color : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: (form as any)[key] ? active : '#888', transition: 'all .2s' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
              <button type="button" onClick={() => setModal(false)}
                style={{ flex: 1, padding: '13px', border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', transition: 'background .2s' }}>
                Bekor qilish
              </button>
              <button type="submit" disabled={saving}
                style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: saving ? '#ccc' : '#D32F2F', cursor: saving ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, color: '#fff', transition: 'background .2s' }}>
                {saving ? 'Saqlanmoqda...' : (editing ? '✓ Saqlash' : '+ Qo\'shish')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
