import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://specodejda.uz'

  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } }).catch(() => [])
  const services = await prisma.service.findMany({ select: { slug: true, updatedAt: true } }).catch(() => [])

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/catalog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacts`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${base}/catalog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const servicePages: MetadataRoute.Sitemap = services.map(s => ({
    url: `${base}/xizmatlar/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...servicePages]
}
