import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [productCount, categoryCount, adminCount, bannerCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.admin.count(),
    prisma.banner.count(),
  ])

  const recentProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  })

  const stats = [
    { label: 'Mahsulotlar', value: productCount, icon: '📦', href: '/dashboard/products', color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Kategoriyalar', value: categoryCount, icon: '🗂️', href: '/dashboard/categories', color: '#10B981', bg: '#ECFDF5' },
    { label: 'Bannerlar', value: bannerCount, icon: '🖼️', href: '/dashboard/banners', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Adminlar', value: adminCount, icon: '👤', href: '#', color: '#8B5CF6', bg: '#F5F3FF' },
  ]

  const quickActions = [
    { href: '/dashboard/products', label: "Mahsulot qo'shish", icon: '📦', desc: 'Yangi mahsulot yaratish' },
    { href: '/dashboard/banners', label: 'Banner qo\'shish', icon: '🖼️', desc: 'Bosh sahifa slider uchun' },
    { href: '/dashboard/categories', label: 'Kategoriya', icon: '🗂️', desc: 'Kategoriya boshqaruvi' },
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: '⚙️', desc: 'Kontakt va xarita' },
  ]

  return (
    <>
      <style>{`
        .stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important; border-color: #E0E0E0 !important; }
        .quick-action:hover { background: #FFF5F5 !important; border-color: #FFCDD2 !important; }
        .product-row:hover { background: #FAFAFA !important; }
        @media (max-width: 640px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ maxWidth: 900 }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <Link key={s.label} href={s.href} className="stat-card"
              style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, transition: 'all .2s' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ fontSize: 28, fontWeight: 800, color: '#111', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{s.label}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="dash-grid">

          {/* Quick actions */}
          <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '20px' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 16 }}>Tezkor harakatlar</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quickActions.map(a => (
                <Link key={a.href} href={a.href} className="quick-action"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, background: '#FAFAFA', textDecoration: 'none', transition: 'all .15s', border: '1px solid transparent' }}
                >
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{a.label}</p>
                    <p style={{ fontSize: 12, color: '#999' }}>{a.desc}</p>
                  </div>
                  <span style={{ color: '#ccc', fontSize: 18 }}>›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent products */}
          <div style={{ background: '#fff', border: '1.5px solid #F0F0F0', borderRadius: 14, padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>So'nggi mahsulotlar</h2>
              <Link href="/dashboard/products" style={{ fontSize: 12, color: '#D32F2F', textDecoration: 'none', fontWeight: 600 }}>
                Barchasini →
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#bbb' }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📦</div>
                <p style={{ fontSize: 13, marginBottom: 16 }}>Mahsulotlar yo'q</p>
                <Link href="/dashboard/products"
                  style={{ display: 'inline-block', background: '#D32F2F', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                  + Qo'shish
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentProducts.map((p: any) => {
                  const imgs = (() => { try { return JSON.parse(p.images) } catch { return [] } })()
                  return (
                    <div key={p.id} className="product-row"
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', borderRadius: 8, transition: 'background .15s' }}
                    >
                      <div style={{ width: 38, height: 38, borderRadius: 8, background: '#F0F0F0', overflow: 'hidden', flexShrink: 0 }}>
                        {imgs[0]
                          ? <img src={imgs[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📦</div>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nameRu}</p>
                        <p style={{ fontSize: 11, color: '#aaa' }}>{p.category?.nameRu}</p>
                      </div>
                      {p.isNew && (
                        <span style={{ fontSize: 10, background: '#FFEBEE', color: '#D32F2F', padding: '2px 7px', borderRadius: 99, fontWeight: 700, flexShrink: 0 }}>NEW</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
