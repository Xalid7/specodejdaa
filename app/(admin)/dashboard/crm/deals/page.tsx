'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface Stage { id: string; name: string; color: string; order: number; type: string }
interface Contact { id: string; name: string; phone?: string; company?: string }
interface Deal {
  id: string; title: string; amount: number; currency: string
  stageId: string; stage: Stage; contact?: Contact; contactId?: string
  assignedTo?: string; dueDate?: string; description?: string; createdAt: string
  _count: { tasks: number; invoices: number }
}

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

const EMPTY_DEAL = { title: '', amount: 0, currency: 'UZS', stageId: '', contactId: '', assignedTo: '', dueDate: '', description: '' }

export default function DealsPage() {
  const [stages, setStages] = useState<Stage[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<typeof EMPTY_DEAL>(EMPTY_DEAL)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [stagesRes, dealsRes, contactsRes] = await Promise.all([
      fetch('/api/crm/pipeline'),
      fetch('/api/crm/deals'),
      fetch('/api/crm/contacts'),
    ])
    const [s, d, c] = await Promise.all([stagesRes.json(), dealsRes.json(), contactsRes.json()])
    setStages(s)
    setDeals(d)
    setContacts(c)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = (stageId?: string) => {
    setEditing({ ...EMPTY_DEAL, stageId: stageId || stages[0]?.id || '' })
    setEditingId(null)
    setShowModal(true)
  }

  const openEdit = (deal: Deal) => {
    setEditing({
      title: deal.title, amount: deal.amount, currency: deal.currency,
      stageId: deal.stageId, contactId: deal.contactId || '', assignedTo: deal.assignedTo || '',
      dueDate: deal.dueDate ? deal.dueDate.split('T')[0] : '', description: deal.description || ''
    })
    setEditingId(deal.id)
    setShowModal(true)
  }

  const save = async () => {
    if (!editing.title?.trim()) return toast.error('Sarlavha kiritish shart')
    if (!editing.stageId) return toast.error('Bosqich tanlang')
    setSaving(true)
    try {
      const body = {
        ...editing,
        amount: Number(editing.amount),
        contactId: editing.contactId || null,
        dueDate: editing.dueDate ? new Date(editing.dueDate).toISOString() : null,
      }
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/crm/deals/${editingId}` : '/api/crm/deals'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success(editingId ? 'Yangilandi' : 'Qo\'shildi')
      setShowModal(false)
      load()
    } catch { toast.error('Xato yuz berdi') }
    setSaving(false)
  }

  const del = async (id: string) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return
    await fetch(`/api/crm/deals/${id}`, { method: 'DELETE' })
    toast.success('O\'chirildi')
    load()
  }

  const moveDeal = async (dealId: string, toStageId: string) => {
    await fetch(`/api/crm/deals/${dealId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stageId: toStageId })
    })
    load()
  }

  const inp = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditing(prev => ({ ...prev, [field]: e.target.value }))

  const totalByStage = (stageId: string) => deals.filter(d => d.stageId === stageId).reduce((s, d) => s + d.amount, 0)

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Yuklanmoqda...</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>Bitimlar Pipeline</h2>
          <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>
            Jami: {fmt(deals.reduce((s, d) => s + d.amount, 0))} so'm · {deals.length} ta bitim
          </p>
        </div>
        <button onClick={() => openNew()}
          style={{ padding: '10px 20px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          + Yangi bitim
        </button>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 16, minHeight: 500 }}>
        {stages.map(stage => {
          const stageDeals = deals.filter(d => d.stageId === stage.id)
          return (
            <div key={stage.id}
              onDragOver={e => { e.preventDefault(); setDragOver(stage.id) }}
              onDrop={e => { e.preventDefault(); if (dragging) moveDeal(dragging, stage.id); setDragging(null); setDragOver(null) }}
              style={{ minWidth: 260, maxWidth: 280, background: dragOver === stage.id ? '#F0F9FF' : '#F8F9FA', borderRadius: 14, padding: 12, border: `2px solid ${dragOver === stage.id ? '#3B82F6' : 'transparent'}`, transition: 'all .15s', flexShrink: 0 }}
            >
              {/* Stage Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: stage.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{stage.name}</span>
                  <span style={{ background: stage.color + '20', color: stage.color, padding: '2px 7px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{stageDeals.length}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 10 }}>{fmt(totalByStage(stage.id))} so'm</div>

              {/* Deal Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {stageDeals.map(deal => (
                  <div key={deal.id}
                    draggable
                    onDragStart={() => setDragging(deal.id)}
                    onDragEnd={() => { setDragging(null); setDragOver(null) }}
                    style={{ background: '#fff', borderRadius: 10, padding: '12px 14px', border: '1px solid #EAEAEA', cursor: 'grab', opacity: dragging === deal.id ? 0.5 : 1, transition: 'box-shadow .15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111', flex: 1, lineHeight: 1.3 }}>{deal.title}</div>
                      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                        <button onClick={() => openEdit(deal)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, padding: 2, color: '#888' }}>✏️</button>
                        <button onClick={() => del(deal.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14, padding: 2, color: '#888' }}>🗑️</button>
                      </div>
                    </div>
                    {deal.contact && (
                      <div style={{ fontSize: 11, color: '#666', marginTop: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span>👤</span> {deal.contact.name} {deal.contact.company && `· ${deal.contact.company}`}
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{fmt(deal.amount)} <span style={{ fontSize: 10, fontWeight: 600, color: '#888' }}>so'm</span></span>
                      {deal.dueDate && (
                        <span style={{ fontSize: 10, color: new Date(deal.dueDate) < new Date() ? '#EF4444' : '#888' }}>
                          📅 {new Date(deal.dueDate).toLocaleDateString('uz-UZ')}
                        </span>
                      )}
                    </div>
                    {(deal._count.tasks > 0 || deal._count.invoices > 0) && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        {deal._count.tasks > 0 && <span style={{ fontSize: 10, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4, color: '#555' }}>✅ {deal._count.tasks}</span>}
                        {deal._count.invoices > 0 && <span style={{ fontSize: 10, background: '#F3F4F6', padding: '2px 6px', borderRadius: 4, color: '#555' }}>📄 {deal._count.invoices}</span>}
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => openNew(stage.id)}
                  style={{ border: '2px dashed #E5E7EB', borderRadius: 10, padding: '10px', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#9CA3AF', fontWeight: 600, transition: 'all .15s', textAlign: 'center' }}>
                  + Bitim qo'shish
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>{editingId ? 'Bitimni tahrirlash' : 'Yangi bitim'}</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Sarlavha *</label>
                <input value={editing.title} onChange={inp('title')} placeholder="Bitim nomi" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Summa</label>
                  <input type="number" value={editing.amount} onChange={inp('amount')} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Bosqich *</label>
                  <select value={editing.stageId} onChange={inp('stageId')} style={inputStyle}>
                    <option value="">Tanlang</option>
                    {stages.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Mijoz</label>
                <select value={editing.contactId} onChange={inp('contactId')} style={inputStyle}>
                  <option value="">Tanlang</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Mas'ul xodim</label>
                  <input value={editing.assignedTo} onChange={inp('assignedTo')} placeholder="Ism" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Muddat</label>
                  <input type="date" value={editing.dueDate} onChange={inp('dueDate')} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }}>Izoh</label>
                <textarea value={editing.description} onChange={inp('description')} rows={3} placeholder="Qo'shimcha ma'lumot..."
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' } as React.CSSProperties} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={cancelBtn}>Bekor qilish</button>
              <button onClick={save} disabled={saving} style={{ ...saveBtn, background: saving ? '#ccc' : '#D32F2F' }}>
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' }
const cancelBtn: React.CSSProperties = { padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: '#fff', color: '#374151', fontWeight: 600 }
const saveBtn: React.CSSProperties = { padding: '10px 24px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }
