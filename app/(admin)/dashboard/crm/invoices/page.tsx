'use client'
import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

interface InvoiceItem { name: string; qty: number; price: number }
interface Payment { id: string; amount: number; method: string; date: string }
interface Invoice {
  id: string; number: string; subtotal: number; discount: number; tax: number; total: number
  currency: string; status: string; dueDate?: string; notes?: string; createdAt: string
  contact?: { id: string; name: string; phone?: string }
  deal?: { id: string; title: string }
  payments: Payment[]
}
interface Contact { id: string; name: string; company?: string }
interface Deal { id: string; title: string }

const STATUSES = ['draft', 'sent', 'paid', 'overdue', 'cancelled']
const STATUS_LABELS: Record<string, string> = { draft: 'Qoralama', sent: 'Yuborildi', paid: 'To\'landi', overdue: 'Muddati o\'tdi', cancelled: 'Bekor' }
const STATUS_COLORS: Record<string, string> = { draft: '#6B7280', sent: '#3B82F6', paid: '#10B981', overdue: '#EF4444', cancelled: '#9CA3AF' }
const METHODS = ['cash', 'bank', 'card', 'click', 'payme']
const METHOD_LABELS: Record<string, string> = { cash: 'Naqd', bank: 'Bank o\'tkazmasi', card: 'Karta', click: 'Click', payme: 'Payme' }

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

const EMPTY_ITEM: InvoiceItem = { name: '', qty: 1, price: 0 }

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState<Invoice | null>(null)
  const [contactId, setContactId] = useState('')
  const [dealId, setDealId] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([{ ...EMPTY_ITEM }])
  const [discount, setDiscount] = useState(0)
  const [tax, setTax] = useState(0)
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [payAmount, setPayAmount] = useState(0)
  const [payMethod, setPayMethod] = useState('cash')

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0)
  const total = subtotal - discount + tax

  const load = useCallback(async () => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    const [invRes, cRes, dRes] = await Promise.all([
      fetch(`/api/crm/invoices?${params}`),
      fetch('/api/crm/contacts'),
      fetch('/api/crm/deals'),
    ])
    const [inv, c, d] = await Promise.all([invRes.json(), cRes.json(), dRes.json()])
    setInvoices(inv); setContacts(c); setDeals(d); setLoading(false)
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const openNew = () => {
    setEditingId(null); setContactId(''); setDealId(''); setItems([{ ...EMPTY_ITEM }])
    setDiscount(0); setTax(0); setDueDate(''); setNotes(''); setShowModal(true)
  }

  const save = async () => {
    if (items.some(i => !i.name.trim())) return toast.error('Barcha mahsulot nomlarini kiriting')
    setSaving(true)
    try {
      const body = {
        contactId: contactId || null, dealId: dealId || null,
        items: JSON.stringify(items), subtotal, discount, tax, total,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null, notes
      }
      const res = await fetch('/api/crm/invoices', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error()
      toast.success('Faktura yaratildi')
      setShowModal(false); load()
    } catch { toast.error('Xato yuz berdi') }
    setSaving(false)
  }

  const addPayment = async () => {
    if (!showPayModal || payAmount <= 0) return toast.error('Summa kiriting')
    const res = await fetch('/api/crm/payments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId: showPayModal.id, amount: payAmount, method: payMethod })
    })
    if (res.ok) { toast.success('To\'lov qo\'shildi'); setShowPayModal(null); load() }
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/crm/invoices/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    load()
  }

  const del = async (id: string) => {
    if (!confirm('O\'chirishni tasdiqlaysizmi?')) return
    await fetch(`/api/crm/invoices/${id}`, { method: 'DELETE' })
    toast.success('O\'chirildi'); load()
  }

  const updateItem = (i: number, field: keyof InvoiceItem, val: string | number) =>
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: field === 'name' ? val : Number(val) } : it))

  const totalPending = invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((s, i) => s + i.total, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>Hisob-fakturalar</h2>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selStyle}>
            <option value="">Barcha statuslar</option>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button onClick={openNew} style={addBtn}>+ Yangi faktura</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {[
          { label: 'To\'landi', value: fmt(totalPaid) + ' so\'m', color: '#10B981' },
          { label: 'Kutilmoqda', value: fmt(totalPending) + ' so\'m', color: '#F59E0B' },
          { label: 'Jami faktura', value: invoices.length + ' ta', color: '#6B7280' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #F0F0F0', borderRadius: 10, padding: '12px 18px' }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F0F0F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Yuklanmoqda...</div>
        ) : invoices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
            <p style={{ color: '#999' }}>Fakturalar topilmadi</p>
            <button onClick={openNew} style={addBtn}>+ Yangi faktura</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F5F5', background: '#FAFAFA' }}>
                  {['Raqam', 'Mijoz', 'Summa', 'To\'langan', 'Muddat', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => {
                  const paid = inv.payments.reduce((s, p) => s + p.amount, 0)
                  const remaining = inv.total - paid
                  const isOverdue = inv.status !== 'paid' && inv.dueDate && new Date(inv.dueDate) < new Date()
                  return (
                    <tr key={inv.id} style={{ borderBottom: i < invoices.length - 1 ? '1px solid #F8F8F8' : 'none', background: isOverdue ? '#FFF8F8' : 'transparent' }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#374151' }}>{inv.number}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{inv.contact?.name || '—'}</div>
                        {inv.contact?.phone && <div style={{ fontSize: 11, color: '#888' }}>{inv.contact.phone}</div>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#111' }}>{fmt(inv.total)} so'm</div>
                        {remaining > 0 && remaining < inv.total && <div style={{ fontSize: 11, color: '#F59E0B' }}>Qoldi: {fmt(remaining)} so'm</div>}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: paid > 0 ? '#10B981' : '#999', fontWeight: paid > 0 ? 700 : 400 }}>
                        {paid > 0 ? `${fmt(paid)} so'm` : '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: isOverdue ? '#EF4444' : '#888', fontWeight: isOverdue ? 700 : 400 }}>
                        {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('uz-UZ') : '—'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <select value={inv.status} onChange={e => updateStatus(inv.id, e.target.value)}
                          style={{ background: STATUS_COLORS[inv.status] + '18', color: STATUS_COLORS[inv.status], border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {inv.status !== 'paid' && (
                            <button onClick={() => { setShowPayModal(inv); setPayAmount(remaining); setPayMethod('cash') }}
                              style={{ padding: '5px 10px', border: '1px solid #BBF7D0', background: '#F0FDF4', borderRadius: 7, fontSize: 11, cursor: 'pointer', color: '#15803D', fontWeight: 700 }}>
                              💳 To'lov
                            </button>
                          )}
                          <button onClick={() => del(inv.id)} style={{ padding: '5px 10px', border: '1px solid #FEE2E2', background: '#FEF2F2', borderRadius: 7, fontSize: 11, cursor: 'pointer', color: '#DC2626', fontWeight: 600 }}>
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Yangi faktura</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Mijoz</label>
                  <select value={contactId} onChange={e => setContactId(e.target.value)} style={inputStyle}>
                    <option value="">Tanlang</option>
                    {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Bitim</label>
                  <select value={dealId} onChange={e => setDealId(e.target.value)} style={inputStyle}>
                    <option value="">Tanlang</option>
                    {deals.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={labelStyle}>Mahsulotlar / Xizmatlar</label>
                  <button onClick={() => setItems(p => [...p, { ...EMPTY_ITEM }])}
                    style={{ fontSize: 12, color: '#D32F2F', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Qo'shish</button>
                </div>
                <div style={{ border: '1px solid #E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 100px 30px', gap: 0, background: '#FAFAFA', padding: '8px 12px', borderBottom: '1px solid #E5E7EB' }}>
                    {['Nomi', 'Miqdor', 'Narx', 'Jami', ''].map(h => <div key={h} style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>{h}</div>)}
                  </div>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 120px 100px 30px', gap: 8, padding: '10px 12px', borderBottom: i < items.length - 1 ? '1px solid #F5F5F5' : 'none', alignItems: 'center' }}>
                      <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Nomi" style={{ ...inputStyle, padding: '7px 10px' }} />
                      <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', e.target.value)} min={1} style={{ ...inputStyle, padding: '7px 10px' }} />
                      <input type="number" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} placeholder="0" style={{ ...inputStyle, padding: '7px 10px' }} />
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>{fmt(item.qty * item.price)}</div>
                      {items.length > 1 && (
                        <button onClick={() => setItems(p => p.filter((_, idx) => idx !== i))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444', fontSize: 16, lineHeight: 1 }}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
                    <span>Jami (chegirmasiz):</span><span style={{ fontWeight: 700 }}>{fmt(subtotal)} so'm</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', alignItems: 'center' }}>
                    <span>Chegirma:</span>
                    <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={{ ...inputStyle, width: 120, padding: '6px 10px', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555', alignItems: 'center' }}>
                    <span>Soliq/QQS:</span>
                    <input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} style={{ ...inputStyle, width: 120, padding: '6px 10px', fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#111', paddingTop: 8, borderTop: '2px solid #F0F0F0' }}>
                    <span>To'lash kerak:</span><span style={{ color: '#D32F2F' }}>{fmt(total)} so'm</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Muddat</label>
                  <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Izoh</label>
                  <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Qo'shimcha..." style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={cancelBtn}>Bekor qilish</button>
              <button onClick={save} disabled={saving} style={{ ...saveBtn, background: saving ? '#ccc' : '#D32F2F' }}>
                {saving ? 'Saqlanmoqda...' : 'Faktura yaratish'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>To'lov qo'shish</h3>
              <button onClick={() => setShowPayModal(null)} style={{ border: 'none', background: 'none', fontSize: 22, cursor: 'pointer', color: '#999' }}>×</button>
            </div>
            <div style={{ marginBottom: 14, padding: '12px', background: '#F9FAFB', borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: '#888' }}>Faktura: {showPayModal.number}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Jami: {fmt(showPayModal.total)} so'm</div>
              <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600 }}>
                To'langan: {fmt(showPayModal.payments.reduce((s, p) => s + p.amount, 0))} so'm
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>To'lov miqdori (so'm)</label>
                <input type="number" value={payAmount} onChange={e => setPayAmount(Number(e.target.value))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>To'lov usuli</label>
                <select value={payMethod} onChange={e => setPayMethod(e.target.value)} style={inputStyle}>
                  {METHODS.map(m => <option key={m} value={m}>{METHOD_LABELS[m]}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPayModal(null)} style={cancelBtn}>Bekor</button>
              <button onClick={addPayment} style={{ ...saveBtn, background: '#10B981' }}>💳 To'lovni saqlash</button>
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
