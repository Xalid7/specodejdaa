'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

function Modal({ title, onClose, children }: any) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} className="modal-wrap">
      <div style={{ background: '#fff', width: '100%', maxWidth: 440, borderRadius: '20px 20px 0 0', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.15)' }} className="modal-inner">
        <div style={{ position: 'sticky', top: 0, background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#F5F5F5', cursor: 'pointer', fontSize: 18, color: '#555' }}>×</button>
        </div>
        <div style={{ padding: '20px' }}>{children}</div>
      </div>
      <style>{`@media(min-width:600px){.modal-wrap{align-items:center!important;padding:16px!important}.modal-inner{border-radius:20px!important}}`}</style>
    </div>
  )
}

const COMMON_ICONS = ['🦺', '👕', '👔', '🥼', '🧥', '🧤', '🥾', '🪖', '🩺', '💼', '🎽', '🧢', '📦', '🏭', '⚙️', '🔧']

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ nameRu: '', nameUz: '', icon: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCats() }, [])
  const fetchCats = () => fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})

  const openAdd = () => { setEditing(null); setForm({ nameRu: '', nameUz: '', icon: '📦' }); setModal(true) }
  const openEdit = (c: any) => { setEditing(c); setForm({ nameRu: c.nameRu, nameUz: c.nameUz, icon: c.icon || '📦' }); setModal(true) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/categories/${editing.id}` : '/api/categories'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    if (res.ok) { toast.success(editing ? 'Yangilandi ✓' : 'Qo\'shildi ✓'); setModal(false); fetchCats() }
    else toast.error('Xatolik')
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" kategoriyasini o'chirmoqchimisiz?`)) return
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('O\'chirildi'); fetchCats() }
    else toast.error('Kategoriyada mahsulotlar bor — avval ularni o\'chiring')
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <button onClick={openAdd}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#D32F2F', color: '#fff', border: 'none', padding: '11px 20px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B71C1C')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D32F2F')}
        >
          + Kategoriya qo'shish
        </button>
      </div>

      <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, overflow: 'hidden' }}>
        {categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#bbb' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🗂️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#999', marginBottom: 16 }}>Kategoriyalar yo'q</p>
            <button onClick={openAdd} style={{ background: '#D32F2F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ Qo'shish</button>
          </div>
        ) : categories.map((c: any, i: number) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderBottom: i < categories.length - 1 ? '1px solid #F5F5F5' : 'none', transition: 'background .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{c.icon || '📦'}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 3 }}>{c.nameRu}</p>
              <p style={{ fontSize: 13, color: '#aaa' }}>{c.nameUz} · <span style={{ color: '#D32F2F', fontWeight: 600 }}>{c._count?.products || 0}</span> ta mahsulot</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => openEdit(c)} style={{ padding: '8px 14px', border: '1.5px solid #E8E8E8', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#555', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#1565C0'; e.currentTarget.style.color = '#1565C0' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.color = '#555' }}>✏️</button>
              <button onClick={() => handleDelete(c.id, c.nameRu)} style={{ padding: '8px 14px', border: '1.5px solid #E8E8E8', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#555', transition: 'all .15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#D32F2F'; e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.color = '#D32F2F' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8E8E8'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#555' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'} onClose={() => setModal(false)}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (RU) *</label>
              <input required value={form.nameRu} onChange={e => setForm(f => ({ ...f, nameRu: e.target.value }))} placeholder="Спецодежда"
                style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 6 }}>Nom (UZ)</label>
              <input value={form.nameUz} onChange={e => setForm(f => ({ ...f, nameUz: e.target.value }))} placeholder="Maxsus kiyim"
                style={{ width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '11px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => (e.target.style.borderColor = '#D32F2F')} onBlur={e => (e.target.style.borderColor = '#E8E8E8')} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 10 }}>Ikonka tanlang</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {COMMON_ICONS.map(ic => (
                  <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                    style={{ width: 44, height: 44, borderRadius: 10, border: `2px solid ${form.icon === ic ? '#D32F2F' : '#E8E8E8'}`, background: form.icon === ic ? '#FFF5F5' : '#FAFAFA', fontSize: 22, cursor: 'pointer', transition: 'all .15s' }}>
                    {ic}
                  </button>
                ))}
              </div>
              <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Yoki emoji kiriting: 🧥"
                style={{ marginTop: 10, width: '100%', border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '10px 13px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '13px', border: '1.5px solid #E0E0E0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555' }}>Bekor</button>
              <button type="submit" disabled={saving} style={{ flex: 2, padding: '13px', border: 'none', borderRadius: 10, background: saving ? '#ccc' : '#D32F2F', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                {saving ? 'Saqlanmoqda...' : (editing ? '✓ Saqlash' : '+ Qo\'shish')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
