'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface Task {
  id: string; title: string; description?: string; priority: string; status: string
  dueDate?: string; assignedTo?: string; createdAt: string
  contact?: { id: string; name: string }
  deal?: { id: string; title: string }
}

interface Contact { id: string; name: string }
interface Deal { id: string; title: string }

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const PRIORITY_LABELS: Record<string, string> = { low: 'Past', medium: 'O\'rta', high: 'Yuqori', urgent: 'Shoshilinch' }
const PRIORITY_COLORS: Record<string, string> = { low: '#6B7280', medium: '#3B82F6', high: '#F59E0B', urgent: '#EF4444' }
const STATUSES = ['todo', 'in_progress', 'done', 'cancelled']
const STATUS_LABELS: Record<string, string> = { todo: 'Bajarilmagan', in_progress: 'Jarayonda', done: 'Bajarildi', cancelled: 'Bekor' }
const STATUS_COLORS: Record<string, string> = { todo: '#6B7280', in_progress: '#3B82F6', done: '#10B981', cancelled: '#9CA3AF' }
const STATUS_ICONS: Record<string, string> = { todo: '⬜', in_progress: '🔄', done: '✅', cancelled: '❌' }

const EMPTY = { title: '', description: '', priority: 'medium', status: 'todo', dueDate: '', assignedTo: '', contactId: '', dealId: '' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<typeof EMPTY>(EMPTY)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    const [tasksRes, contactsRes, dealsRes] = await Promise.all([
      fetch(`/api/crm/tasks?${params}`),
      fetch('/api/crm/contacts'),
      fetch('/api/crm/deals'),
    ])
    const [t, c, d] = await Promise.all([tasksRes.json(), contactsRes.json(), dealsRes.json()])
    setTasks(t); setContacts(c); setDeals(d); setLoading(false)
  }, [statusFilter, priorityFilter])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditing(EMPTY); setEditingId(null); setShowModal(true) }
  const openEdit = (t: Task) => {
    setEditing({
      title: t.title, description: t.description || '', priority: t.priority, status: t.status,
      dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
      assignedTo: t.assignedTo || '', contactId: t.contact?.id || '', dealId: t.deal?.id || ''
    })
    setEditingId(t.id); setShowModal(true)
  }

  const save = async () => {
    if (!editing.title?.trim()) return toast.error('Sarlavha kiritish shart')
    setSaving(true)
    try {
      const body = {
        ...editing,
        contactId: editing.contactId || null,
        dealId: editing.dealId || null,
        dueDate: editing.dueDate ? new Date(editing.dueDate).toISOString() : null,
      }
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/crm/tasks/${editingId}` : '/api/crm/tasks'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success(editingId ? 'Yangilandi' : 'Qo\'shildi')
      setShowModal(false); load()
    } catch { toast.error('Xato yuz berdi') }
    setSaving(false)
  }

  const toggleStatus = async (task: Task) => {
    const next = task.status === 'done' ? 'todo' : task.status === 'todo' ? 'in_progress' : task.status === 'in_progress' ? 'done' : 'todo'
    await fetch(`/api/crm/tasks/${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return
    await fetch(`/api/crm/tasks/${id}`, { method: 'DELETE' })
    toast.success('O\'chirildi'); load()
  }

  const inp = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setEditing(prev => ({ ...prev, [field]: e.target.value }))

  const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date())
  const today = tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate).toDateString() === new Date().toDateString())

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>Vazifalar</h2>
          {overdue.length > 0 && <p style={{ fontSize: 12, color: '#EF4444', margin: '2px 0 0', fontWeight: 600 }}>⚠️ {overdue.length} ta muddati o'tgan</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selStyle}>
            <option value="">Barcha statuslar</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} style={selStyle}>
            <option value="">Barcha muhimlik</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
          </select>
          <button onClick={openNew} style={addBtn}>+ Yangi vazifa</button>
        </div>
      </div>

      {/* Quick stats */}
      {today.length > 0 && (
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: '10px 16px', fontSize: 13, color: '#1D4ED8', fontWeight: 600 }}>
          📅 Bugungi {today.length} ta vazifa tugatilishi kerak
        </div>
      )}

      {/* Task List */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F0F0F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Yuklanmoqda...</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ color: '#999' }}>Vazifalar topilmadi</p>
            <button onClick={openNew} style={addBtn}>+ Yangi vazifa</button>
          </div>
        ) : (
          <div>
            {tasks.map((task, i) => {
              const isOverdue = task.status !== 'done' && task.dueDate && new Date(task.dueDate) < new Date()
              return (
                <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderBottom: i < tasks.length - 1 ? '1px solid #F8F8F8' : 'none', background: task.status === 'done' ? '#FAFAFA' : isOverdue ? '#FFF8F8' : 'transparent' }}>
                  <button onClick={() => toggleStatus(task)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '2px 0', flexShrink: 0, marginTop: 2 }}>
                    {STATUS_ICONS[task.status]}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: task.status === 'done' ? '#9CA3AF' : '#111', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                        {task.title}
                      </span>
                      <span style={{ background: PRIORITY_COLORS[task.priority] + '18', color: PRIORITY_COLORS[task.priority], padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      <span style={{ background: STATUS_COLORS[task.status] + '18', color: STATUS_COLORS[task.status], padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </div>
                    {task.description && <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>{task.description}</div>}
                    <div style={{ display: 'flex', gap: 12, marginTop: 5, fontSize: 11, color: '#999', flexWrap: 'wrap' }}>
                      {task.contact && <span>👤 {task.contact.name}</span>}
                      {task.deal && <span>🤝 {task.deal.title}</span>}
                      {task.assignedTo && <span>👷 {task.assignedTo}</span>}
                      {task.dueDate && (
                        <span style={{ color: isOverdue ? '#EF4444' : '#999', fontWeight: isOverdue ? 700 : 400 }}>
                          📅 {new Date(task.dueDate).toLocaleDateString('uz-UZ')} {isOverdue ? '(muddati o\'tgan!)' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button onClick={() => openEdit(task)} style={{ border: '1px solid #E5E7EB', background: '#fff', borderRadius: 7, padding: '5px 10px', fontSize: 12, cursor: 'pointer', color: '#555', fontWeight: 600 }}>Tahrir</button>
                    <button onClick={() => del(task.id)} style={{ border: '1px solid #FEE2E2', background: '#FEF2F2', borderRadius: 7, padding: '5px 10px', fontSize: 12, cursor: 'pointer', color: '#DC2626', fontWeight: 600 }}>O'chirish</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111', margin: 0 }}>{editingId ? 'Vazifani tahrirlash' : 'Yangi vazifa'}</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Sarlavha *</label>
                <input value={editing.title} onChange={inp('title')} placeholder="Vazifa nomi" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Tavsif</label>
                <textarea value={editing.description} onChange={inp('description')} rows={2} placeholder="Izoh..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' } as React.CSSProperties} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Muhimlik</label>
                  <select value={editing.priority} onChange={inp('priority')} style={inputStyle}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={editing.status} onChange={inp('status')} style={inputStyle}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Muddat</label>
                  <input type="date" value={editing.dueDate} onChange={inp('dueDate')} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Mas'ul xodim</label>
                  <input value={editing.assignedTo} onChange={inp('assignedTo')} placeholder="Ism" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mijoz</label>
                <select value={editing.contactId} onChange={inp('contactId')} style={inputStyle}>
                  <option value="">Tanlang</option>
                  {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Bitim</label>
                <select value={editing.dealId} onChange={inp('dealId')} style={inputStyle}>
                  <option value="">Tanlang</option>
                  {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                </select>
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

const selStyle: React.CSSProperties = { padding: '10px 14px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, outline: 'none', background: '#fff' }
const addBtn: React.CSSProperties = { padding: '10px 20px', background: '#D32F2F', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: '#fff' }
const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 5 }
const cancelBtn: React.CSSProperties = { padding: '10px 20px', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 14, cursor: 'pointer', background: '#fff', color: '#374151', fontWeight: 600 }
const saveBtn: React.CSSProperties = { padding: '10px 24px', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer' }
