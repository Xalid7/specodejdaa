import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
import Link from 'next/link'
import ProductGallery from './ProductGallery'
import OrderSection from './OrderSection'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
  if (!product) return {}
  const images = (() => { try { return JSON.parse(product.images) } catch { return [] } })()
  return {
    title: product.nameRu,
    description: `${product.nameRu} — ${product.category?.nameRu || 'спецодежда'}. Заказать в Ташкенте у производителя ART PRINT. ${product.descriptionRu?.slice(0, 100) || ''}`,
    openGraph: {
      title: product.nameRu,
      images: images[0] ? [{ url: images[0] }] : [],
    },
    alternates: { canonical: `https://specodejda.uz/catalog/${slug}` },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } })
  if (!product) notFound()

  const settings = await prisma.settings.findFirst()
  const images = (() => { try { return JSON.parse(product.images) } catch { return [] } })()

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '20px 16px 60px' }}>
      <style>{`
        .breadcrumb-link { color: #aaa; text-decoration: none; transition: color .2s; }
        .breadcrumb-link:hover { color: #D32F2F; }
        @media (max-width: 640px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#aaa', marginBottom: 24, flexWrap: 'wrap' }}>
        <Link href="/" className="breadcrumb-link">Главная</Link>
        <span>›</span>
        <Link href="/catalog" className="breadcrumb-link">Каталог</Link>
        <span>›</span>
        <span style={{ color: '#555', fontWeight: 500 }}>{product.nameRu}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="product-grid">
        <ProductGallery images={images} name={product.nameRu} />

        <div>
          <div style={{ display: 'inline-block', background: '#FFEBEE', color: '#D32F2F', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 99, marginBottom: 14 }}>
            {product.category?.nameRu}
          </div>

          <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#111', marginBottom: 16, lineHeight: 1.3, letterSpacing: -0.3 }}>
            {product.nameRu}
          </h1>

          {product.descRu && (
            <p style={{ fontSize: 15, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>{product.descRu}</p>
          )}

          {/* Badges */}
          {(product.isNew || product.isCollection || product.isHoliday) && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {product.isNew && <span style={{ background: '#FFEBEE', color: '#D32F2F', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 99 }}>🆕 НОВИНКА</span>}
              {product.isCollection && <span style={{ background: '#E3F2FD', color: '#1565C0', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 99 }}>🔥 HIT</span>}
              {product.isHoliday && <span style={{ background: '#FFF8E1', color: '#F57F17', fontSize: 12, fontWeight: 700, padding: '5px 14px', borderRadius: 99 }}>🎉 К ПРАЗДНИКАМ</span>}
            </div>
          )}

          <OrderSection
            telegram={settings?.telegram || null}
            phone={settings?.phone || null}
            email={settings?.email || null}
            productName={product.nameRu}
          />
        </div>
      </div>
    </div>
  )
}
