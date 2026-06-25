'use client'
import { useState, useEffect } from 'react'

interface Stats {
  contacts: { total: number; newThisMonth: number }
  deals: { total: number; won: number; lost: number; active: number }
  invoices: { total: number; paid: number; pending: number }
  tasks: { total: number; done: number; overdue: number; active: number }
  revenue: { total: number; thisMonth: number; pending: number }
  recentActivities: { id: string; type: string; title: string; createdAt: string; contact?: { name: string } }[]
}

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ background: '#F3F4F6', borderRadius: 100, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100, transition: 'width 0.6s ease' }} />
    </div>
  )
}

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) })
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Yuklanmoqda...</div>
  if (!stats) return null

  const winRate = stats.deals.total > 0 ? Math.round((stats.deals.won / stats.deals.total) * 100) : 0
  const taskRate = stats.tasks.total > 0 ? Math.round((stats.tasks.done / stats.tasks.total) * 100) : 0
  const invoiceRate = stats.invoices.total > 0 ? Math.round((stats.invoices.paid / stats.invoices.total) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>Hisobotlar & Statistika</h2>
        <p style={{ fontSize: 12, color: '#888', margin: '2px 0 0' }}>Umumiy ko'rsatkichlar</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Jami daromad', value: fmt(stats.revenue.total) + ' so\'m', sub: `Bu oy: ${fmt(stats.revenue.thisMonth)} so'm`, color: '#10B981', icon: '💰' },
          { label: 'Kutilayotgan to\'lov', value: fmt(stats.revenue.pending) + ' so\'m', sub: `${stats.invoices.pending} ta faktura`, color: '#F59E0B', icon: '⏳' },
          { label: 'Jami mijozlar', value: stats.contacts.total + ' ta', sub: `Bu oy +${stats.contacts.newThisMonth} ta yangi`, color: '#3B82F6', icon: '👥' },
          { label: 'Bitim yutish foizi', value: winRate + '%', sub: `${stats.deals.won} yutildi / ${stats.deals.total} jami`, color: winRate >= 50 ? '#10B981' : '#EF4444', icon: '🎯' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #F0F0F0' }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: c.color }}>{c.value}</div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Progress sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Deals stats */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Bitimlar holati</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Faol bitimlar', value: stats.deals.active, total: stats.deals.total, color: '#3B82F6' },
              { label: 'Yutilgan', value: stats.deals.won, total: stats.deals.total, color: '#10B981' },
              { label: 'Yo\'qotilgan', value: stats.deals.lost, total: stats.deals.total, color: '#EF4444' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: '#555', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 800 }}>{row.value} ta</span>
                </div>
                <Bar value={row.value} max={row.total} color={row.color} />
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#666' }}>Yutish darajasi</span>
              <span style={{ fontWeight: 800, color: winRate >= 50 ? '#10B981' : '#F59E0B' }}>{winRate}%</span>
            </div>
          </div>
        </div>

        {/* Task stats */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Vazifalar holati</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Bajarildi', value: stats.tasks.done, total: stats.tasks.total, color: '#10B981' },
              { label: 'Faol', value: stats.tasks.active, total: stats.tasks.total, color: '#3B82F6' },
              { label: 'Muddati o\'tgan', value: stats.tasks.overdue, total: stats.tasks.total, color: '#EF4444' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: '#555', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 800 }}>{row.value} ta</span>
                </div>
                <Bar value={row.value} max={row.total} color={row.color} />
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#666' }}>Bajarish darajasi</span>
              <span style={{ fontWeight: 800, color: taskRate >= 70 ? '#10B981' : '#F59E0B' }}>{taskRate}%</span>
            </div>
          </div>
        </div>

        {/* Invoice stats */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Fakturalar holati</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'To\'landi', value: stats.invoices.paid, total: stats.invoices.total, color: '#10B981' },
              { label: 'Kutilmoqda', value: stats.invoices.pending, total: stats.invoices.total, color: '#F59E0B' },
            ].map(row => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: '#555', fontWeight: 600 }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 800 }}>{row.value} ta</span>
                </div>
                <Bar value={row.value} max={row.total} color={row.color} />
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ color: '#666' }}>To'lash darajasi</span>
              <span style={{ fontWeight: 800, color: invoiceRate >= 70 ? '#10B981' : '#F59E0B' }}>{invoiceRate}%</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>Moliyaviy ko'rsatkichlar</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Jami tushim', value: fmt(stats.revenue.total) + ' so\'m', icon: '💰', color: '#10B981' },
              { label: 'Bu oylik tushim', value: fmt(stats.revenue.thisMonth) + ' so\'m', icon: '📅', color: '#3B82F6' },
              { label: 'Kutilayotgan', value: fmt(stats.revenue.pending) + ' so\'m', icon: '⏳', color: '#F59E0B' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: '#F9FAFB', borderRadius: 8 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: '#555' }}>
                  <span>{row.icon}</span><span style={{ fontWeight: 600 }}>{row.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activities */}
      <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>So'nggi faoliyatlar</h3>
        {stats.recentActivities.length === 0 ? (
          <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Faoliyatlar topilmadi</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stats.recentActivities.map(a => (
              <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 12px', background: '#FAFAFA', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                  {a.type === 'call' ? '📞' : a.type === 'email' ? '✉️' : a.type === 'meeting' ? '📅' : '📝'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                    {a.contact?.name && <span>{a.contact.name} · </span>}
                    {new Date(a.createdAt).toLocaleString('uz-UZ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
