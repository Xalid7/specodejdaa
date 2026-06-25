'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  contacts: { total: number; newThisMonth: number }
  deals: { total: number; won: number; lost: number; active: number }
  invoices: { total: number; paid: number; pending: number }
  tasks: { total: number; done: number; overdue: number; active: number }
  revenue: { total: number; thisMonth: number; pending: number }
  recentActivities: { id: string; type: string; title: string; createdAt: string; contact?: { name: string } }[]
}

const fmt = (n: number) => new Intl.NumberFormat('uz-UZ').format(Math.round(n))

const STAT_CARDS = (s: Stats) => [
  { label: 'Mijozlar', value: s.contacts.total, sub: `+${s.contacts.newThisMonth} bu oy`, color: '#3B82F6', icon: '👥', href: '/dashboard/crm/contacts' },
  { label: 'Faol bitimlar', value: s.deals.active, sub: `${s.deals.won} yutildi`, color: '#10B981', icon: '🤝', href: '/dashboard/crm/deals' },
  { label: 'Bu oylik daromad', value: fmt(s.revenue.thisMonth) + ' so\'m', sub: `Jami: ${fmt(s.revenue.total)} so'm`, color: '#8B5CF6', icon: '💰', href: '/dashboard/crm/payments' },
  { label: 'Vazifalar', value: s.tasks.active, sub: s.tasks.overdue > 0 ? `⚠️ ${s.tasks.overdue} muddati o'tgan` : `${s.tasks.done} bajarildi`, color: s.tasks.overdue > 0 ? '#EF4444' : '#F59E0B', icon: '✅', href: '/dashboard/crm/tasks' },
  { label: 'Kutilayotgan to\'lov', value: fmt(s.revenue.pending) + ' so\'m', sub: `${s.invoices.pending} faktura`, color: '#F59E0B', icon: '📄', href: '/dashboard/crm/invoices' },
  { label: 'To\'langan fakturalar', value: s.invoices.paid, sub: `Jami: ${s.invoices.total}`, color: '#10B981', icon: '✔️', href: '/dashboard/crm/invoices' },
]

const QUICK_LINKS = [
  { href: '/dashboard/crm/contacts', icon: '👤', label: 'Yangi mijoz' },
  { href: '/dashboard/crm/deals', icon: '🤝', label: 'Yangi bitim' },
  { href: '/dashboard/crm/tasks', icon: '📌', label: 'Yangi vazifa' },
  { href: '/dashboard/crm/invoices', icon: '📋', label: 'Faktura yaratish' },
  { href: '/dashboard/crm/payments', icon: '💳', label: 'To\'lov kiritish' },
  { href: '/dashboard/crm/reports', icon: '📊', label: 'Hisobotlar' },
]

const ACTIVITY_ICONS: Record<string, string> = {
  call: '📞', email: '✉️', meeting: '📅', note: '📝', task: '✅', deal: '🤝', invoice: '📄', payment: '💰'
}

export default function CrmDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/crm/stats').then(r => r.json()).then(data => { setStats(data); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <p>Yuklanmoqda...</p>
      </div>
    </div>
  )

  if (!stats) return null

  const cards = STAT_CARDS(stats)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: 0 }}>CRM Dashboard</h2>
          <p style={{ fontSize: 13, color: '#888', margin: '4px 0 0' }}>Specodejda fabrika boshqaruv markazi</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {QUICK_LINKS.map(l => (
            <Link key={l.href} href={l.href}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none', color: '#374151', transition: 'all .15s' }}
            >
              <span>{l.icon}</span> {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {cards.map((card, i) => (
          <Link key={i} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: '20px 20px', border: '1px solid #F0F0F0', cursor: 'pointer', transition: 'all .2s', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 28, opacity: 0.15 }}>{card.icon}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: card.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>{card.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.2 }}>{card.value}</div>
              <div style={{ fontSize: 11, color: card.color, marginTop: 4, fontWeight: 600 }}>{card.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent activities */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>So'nggi faoliyatlar</h3>
          {stats.recentActivities.length === 0 ? (
            <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Hali faoliyat yo'q</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.recentActivities.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                    {ACTIVITY_ICONS[a.type] || '📌'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
                    <div style={{ fontSize: 11, color: '#999' }}>
                      {a.contact?.name && <span>{a.contact.name} · </span>}
                      {new Date(a.createdAt).toLocaleDateString('uz-UZ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CRM Nav */}
        <div style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #F0F0F0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>CRM bo'limlari</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/dashboard/crm/contacts', icon: '👥', label: 'Mijozlar', desc: `${stats.contacts.total} ta` },
              { href: '/dashboard/crm/deals', icon: '🤝', label: 'Bitimlar (Pipeline)', desc: `${stats.deals.total} ta` },
              { href: '/dashboard/crm/tasks', icon: '✅', label: 'Vazifalar', desc: `${stats.tasks.active} ta faol` },
              { href: '/dashboard/crm/invoices', icon: '📄', label: 'Hisob-fakturalar', desc: `${stats.invoices.total} ta` },
              { href: '/dashboard/crm/payments', icon: '💳', label: 'To\'lovlar', desc: `${fmt(stats.revenue.total)} so'm` },
              { href: '/dashboard/crm/reports', icon: '📊', label: 'Hisobotlar', desc: 'Statistika' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', transition: 'background .15s', color: 'inherit' }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{item.label}</div>
                </div>
                <span style={{ fontSize: 12, color: '#999' }}>{item.desc}</span>
                <span style={{ color: '#ccc', fontSize: 16 }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
