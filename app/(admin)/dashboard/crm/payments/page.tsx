'use client'
import { useState, useEffect } from 'react'

interface Payment {
  id: string; amount: number; method: string; date: string; notes?: string
  invoice: {
    number: string; total: number; status: string
    contact?: { name: string }
  }
}

const METHOD_LABELS: Record<string, string> = { cash: 'Naqd', bank: 'Bank o\'tkazmasi', card: 'Karta', click: 'Click', payme: 'Payme' }
const METHOD_ICONS: Record<string, string> = { cash: '💵', bank: '🏦', card: '💳', click: '📱', payme: '📱' }
const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/payments').then(r => r.json()).then(d => { setPayments(d); setLoading(false) })
  }, [])

  const total = payments.reduce((s, p) => s + p.amount, 0)
  const byMethod = METHODS.map(m => ({ method: m, total: payments.filter(p => p.method === m).reduce((s, p) => s + p.amount, 0) })).filter(m => m.total > 0)

  const now = new Date()
  const thisMonth = payments.filter(p => {
    const d = new Date(p.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, p) => s + p.amount, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>To'lovlar tarixi</h2>
        <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>Jami tushimlar</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
        {[
          { label: 'Jami tushim', value: fmt(total) + ' so\'m', color: '#10B981', icon: '💰' },
          { label: 'Bu oylik tushim', value: fmt(thisMonth) + ' so\'m', color: '#3B82F6', icon: '📅' },
          { label: 'To\'lovlar soni', value: payments.length + ' ta', color: '#8B5CF6', icon: '🧾' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 12, padding: '16px 18px', border: '1px solid #F0F0F0' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* By method */}
      {byMethod.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 18, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 14px' }}>To'lov usullari bo'yicha</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {byMethod.map(m => (
              <div key={m.method} style={{ background: '#F9FAFB', borderRadius: 10, padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>{METHOD_ICONS[m.method]}</span>
                <div>
                  <div style={{ fontSize: 11, color: '#888' }}>{METHOD_LABELS[m.method]}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>{fmt(m.total)} so'm</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments List */}
      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F0F0F0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>Yuklanmoqda...</div>
        ) : payments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
            <p style={{ color: '#999' }}>To'lovlar topilmadi</p>
            <p style={{ fontSize: 12, color: '#bbb' }}>Hisob-fakturalar bo'limidan to'lov qo'shishingiz mumkin</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F5F5F5', background: '#FAFAFA' }}>
                  {['Sana', 'Mijoz', 'Faktura', 'Miqdor', 'Usul', 'Izoh'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < payments.length - 1 ? '1px solid #F8F8F8' : 'none' }}>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#555' }}>
                      {new Date(p.date).toLocaleDateString('uz-UZ')}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, color: '#111' }}>
                      {p.invoice.contact?.name || '—'}
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: '#374151' }}>{p.invoice.number}</td>
                    <td style={{ padding: '13px 16px', fontSize: 14, fontWeight: 800, color: '#10B981' }}>
                      +{fmt(p.amount)} so'm
                    </td>
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#374151' }}>
                        <span>{METHOD_ICONS[p.method]}</span> {METHOD_LABELS[p.method]}
                      </span>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: '#888' }}>{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const METHODS = ['cash', 'bank', 'card', 'click', 'payme']
