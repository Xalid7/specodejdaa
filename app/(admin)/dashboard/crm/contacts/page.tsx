'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface Contact {
  id: string
  name: string
  phone?: string
  email?: string
  company?: string
  position?: string
  source?: string
  status: string
  notes?: string
  createdAt: string
  _count: { deals: number; tasks: number; invoices: number }
}

const SOURCES = ['website', 'call', 'referral', 'social', 'exhibition', 'other']
const SOURCE_LABELS: Record<string, string> = {
  website: 'Sayt', call: 'Qo\'ng\'iroq', referral: 'Tavsiya', social: 'Ijtimoiy tarmoq', exhibition: 'Ko\'rgazma', other: 'Boshqa'
}
const STATUSES = ['active', 'inactive', 'blocked']
const STATUS_LABELS: Record<string, string> = { active: 'Faol', inactive: 'Nofaol', blocked: 'Bloklangan' }
const STATUS_COLORS: Record<string, string> = { active: '#10B981', inactive: '#F59E0B', blocked: '#EF4444' }

const EMPTY: Partial<Contact> = { name: '', phone: '', email: '', company: '', position: '', source: '', status: 'active', notes: '' }

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Partial<Contact>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (statusFilter) params.set('status', statusFilter)
    const res = await fetch(`/api/crm/contacts?${params}`)
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }, [search, statusFilter])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(EMPTY); setShowModal(true) }
  const openEdit = (c: Contact) => { setEditing(c); setShowModal(true) }

  const save = async () => {
    if (!editing.name?.trim()) return toast.error('Ism kiritish shart')
    setSaving(true)
    try {
      const method = editing.id ? 'PUT' : 'POST'
      const url = editing.id ? `/api/crm/contacts/${editing.id}` : '/api/crm/contacts'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) })
      if (!res.ok) throw new Error()
      toast.success(editing.id ? 'Yangilandi' : 'Qo\'shildi')
      setShowModal(false)
      load()
    } catch { toast.error('Xato yuz berdi') }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return
    await fetch(`/api/crm/contacts/${id}`, { method: 'DELETE' })
    toast.success('O\'chirildi')
    load()
  }

  const inp = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditing(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ism, telefon, email, kompaniya qidirish..."
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }}>
          <option value="">Barcha statuslar</option>
          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <button onClick={openNew}
          style={{ padding: '10px 20px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Yangi mijoz
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Jami', value: contacts.length, color: '#374151' },
          { label: 'Faol', value: contacts.filter(c => c.status === 'active').length, color: '#10B981' },
          { label: 'Nofaol', value: contacts.filter(c => c.status === 'inactive').length, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#888' }}>{s.label}:</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F0F0F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Yuklanmoqda...</div>
        ) : contacts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ color: '#999', fontSize: 14 }}>Mijoz topilmadi</p>
            <button onClick={openNew} style={{ marginTop: 12, padding: '10px 20px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>+ Yangi mijoz</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F5F5', background: '#FAFAFA' }}>
                  {['Mijoz', 'Telefon', 'Kompaniya', 'Manba', 'Bitimlar', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id}
                    onClick={() => setSelected(selected === c.id ? null : c.id)}
                    style={{ borderBottom: '1px solid #F8F8F8', cursor: 'pointer', background: selected === c.id ? '#FFF8F8' : 'transparent', transition: 'background .1s' }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#D32F2F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                          {c.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{c.name}</div>
                          {c.email && <div style={{ fontSize: 12, color: '#999' }}>{c.email}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>{c.phone || '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#374151' }}>
                      {c.company && <div style={{ fontWeight: 600 }}>{c.company}</div>}
                      {c.position && <div style={{ fontSize: 12, color: '#888' }}>{c.position}</div>}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#666' }}>{c.source ? SOURCE_LABELS[c.source] || c.source : '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                        <span style={{ background: '#EEF2FF', color: '#4338CA', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>🤝 {c._count.deals}</span>
                        <span style={{ background: '#F0FDF4', color: '#15803D', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>✅ {c._count.tasks}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: STATUS_COLORS[c.status] + '18', color: STATUS_COLORS[c.status], padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => openEdit(c)}
                          style={{ padding: '6px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: '#fff', color: '#374151', fontWeight: 600 }}>
                          Tahrir
                        </button>
                        <button onClick={() => del(c.id)}
                          style={{ padding: '6px 12px', border: '1px solid #FEE2E2', borderRadius: 8, fontSize: 12, cursor: 'pointer', background: '#FEF2F2', color: '#DC2626', fontWeight: 600 }}>
                          O'chirish
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>{editing.id ? 'Mijozni tahrirlash' : 'Yangi mijoz'}</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#999', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Ism *', field: 'name', placeholder: 'To\'liq ism' },
                { label: 'Telefon', field: 'phone', placeholder: '+998 90 000 00 00' },
                { label: 'Email', field: 'email', placeholder: 'email@example.com' },
                { label: 'Kompaniya', field: 'company', placeholder: 'Kompaniya nomi' },
                { label: 'Lavozim', field: 'position', placeholder: 'Direktor, menejer...' },
              ].map(f => (
                <div key={f.field}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>{f.label}</label>
                  <input value={(editing as Record<string, string>)[f.field] || ''} onChange={inp(f.field)} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Manba</label>
                  <select value={editing.source || ''} onChange={inp('source')}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="">Tanlang</option>
                    {SOURCES.map(s => <option key={s} value={s}>{SOURCE_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Status</label>
                  <select value={editing.status || 'active'} onChange={inp('status')}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', background: '#fff' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Izoh</label>
                <textarea value={editing.notes || ''} onChange={inp('notes')} rows={3} placeholder="Qo'shimcha ma'lumot..."
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: '#fff', color: '#374151', fontWeight: 600 }}>
                Bekor qilish
              </button>
              <button onClick={save} disabled={saving}
                style={{ padding: '10px 24px', background: saving ? '#ccc' : '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
