'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

const nav = [
  { href: '/dashboard', label: 'Bosh sahifa', icon: '🏠', exact: true },
  { href: '/dashboard/crm', label: 'CRM', icon: '📊' },
  { href: '/dashboard/crm/contacts', label: 'Mijozlar', icon: '👥' },
  { href: '/dashboard/crm/deals', label: 'Bitimlar', icon: '🤝' },
  { href: '/dashboard/crm/tasks', label: 'Vazifalar', icon: '✅' },
  { href: '/dashboard/crm/invoices', label: 'Fakturalar', icon: '📄' },
  { href: '/dashboard/crm/payments', label: "To'lovlar", icon: '💳' },
  { href: '/dashboard/crm/reports', label: 'Hisobotlar', icon: '📈' },
  { href: '/dashboard/products', label: 'Mahsulotlar', icon: '📦' },
  { href: '/dashboard/categories', label: 'Kategoriyalar', icon: '🗂️' },
  { href: '/dashboard/partners', label: 'Hamkorlar', icon: '🫱' },
  { href: '/dashboard/banners', label: 'Bannerlar', icon: '🖼️' },
  { href: '/dashboard/nav-services', label: 'Xizmatlar', icon: '🔗' },
  { href: '/dashboard/settings', label: 'Sozlamalar', icon: '⚙️' },
]

function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      {/* Logo */}
      <div style={{ padding: '18px 16px', borderBottom: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#D32F2F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 900, fontSize: 9, textAlign: 'center', lineHeight: 1.3 }}>Art<br/>Print</span>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 13, color: '#111' }}>ART PRINT</p>
            <p style={{ fontSize: 11, color: '#aaa' }}>Admin Panel</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#999', lineHeight: 1 }}>×</button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {nav.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontSize: 14, fontWeight: active ? 700 : 500, textDecoration: 'none', transition: 'all .15s', background: active ? '#D32F2F' : 'transparent', color: active ? '#fff' : '#555', border: 'none' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.color = '#D32F2F' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' } }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
        <a href="/" target="_blank" onClick={onClose}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontSize: 14, fontWeight: 500, textDecoration: 'none', color: '#888', marginTop: 8, transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.color = '#333' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888' }}
        >
          <span style={{ fontSize: 18 }}>🌐</span>
          Saytni ko'rish ↗
        </a>
      </nav>

      {/* Logout */}
      <div style={{ padding: '8px', borderTop: '1px solid #F5F5F5' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 10, fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer', color: '#D32F2F', background: 'transparent', transition: 'background .15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 18 }}>🚪</span>
          Chiqish
        </button>
      </div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const pageTitle = nav.find(n => n.exact ? pathname === n.href : pathname === n.href)?.label ||
    nav.find(n => !n.exact && pathname.startsWith(n.href))?.label || 'Dashboard'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F8F8' }}>

      {/* Desktop sidebar */}
      <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid #F0F0F0', height: '100vh', position: 'sticky', top: 0 }} className="admin-desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', flex: 1 }} onClick={() => setSidebarOpen(false)} />
          <div style={{ width: 260, height: '100%', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', display: 'none' }} className="admin-mobile-sidebar-panel">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #F0F0F0', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ display: 'none', border: 'none', background: 'none', cursor: 'pointer', padding: 6, borderRadius: 8, color: '#555' }} className="admin-hamburger">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#111', flex: 1 }}>{pageTitle}</h1>
          <a href="/" target="_blank"
            style={{ fontSize: 12, color: '#888', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #E8E8E8', borderRadius: 8, transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#D32F2F'; e.currentTarget.style.borderColor = '#D32F2F' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.borderColor = '#E8E8E8' }}
          >
            <span>🌐</span> Sayt
          </a>
        </div>

        {/* Content */}
        <main style={{ flex: 1, padding: '24px 20px', overflow: 'auto' }}>
          {children}
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-sidebar { display: none !important; }
          .admin-hamburger { display: flex !important; }
          .admin-mobile-sidebar-panel { display: block !important; }
        }
      `}</style>
    </div>
  )
}
