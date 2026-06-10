'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const nav = [
  { href: '/dashboard', label: 'Bosh sahifa', icon: '🏠' },
  { href: '/dashboard/products', label: 'Mahsulotlar', icon: '📦' },
  { href: '/dashboard/categories', label: 'Kategoriyalar', icon: '🗂️' },
  { href: '/dashboard/partners', label: 'Hamkorlar', icon: '🤝' },
  { href: '/dashboard/banners', label: 'Bannerlar', icon: '🖼️' },
  { href: '/dashboard/nav-services', label: 'Xizmatlar menyusi', icon: '🔗' },
  { href: '/dashboard/settings', label: 'Sozlamalar', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid #F5F5F5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#D32F2F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 10, lineHeight: 1.2, textAlign: 'center' }}>Art<br/>Print</span>
          </div>
          <div>
            <p style={{ fontWeight: 800, fontSize: 14, color: '#111', letterSpacing: -0.3 }}>ART PRINT</p>
            <p style={{ fontSize: 11, color: '#999' }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {nav.map(item => {
          const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: active ? 700 : 500, textDecoration: 'none', transition: 'all .15s', background: active ? '#D32F2F' : 'transparent', color: active ? '#fff' : '#555' }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#FFF5F5'; e.currentTarget.style.color = '#D32F2F' } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' } }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}

        <a href="/" target="_blank"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: 500, textDecoration: 'none', color: '#555', marginTop: 8, transition: 'all .15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F5F5F5'; e.currentTarget.style.color = '#333' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555' }}
        >
          <span style={{ fontSize: 16 }}>🌐</span>
          Saytni ko'rish ↗
        </a>
      </nav>

      {/* Logout */}
      <div style={{ padding: 8, borderTop: '1px solid #F5F5F5' }}>
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: 'none', cursor: 'pointer', color: '#D32F2F', background: 'transparent', transition: 'all .15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 16 }}>🚪</span>
          Chiqish
        </button>
      </div>
    </aside>
  )
}
