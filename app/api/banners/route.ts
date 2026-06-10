import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(banners)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const count = await prisma.banner.count()
  const banner = await prisma.banner.create({
    data: {
      imageUrl: body.imageUrl,
      titleRu: body.titleRu || null,
      titleUz: body.titleUz || null,
      subtitleRu: body.subtitleRu || null,
      subtitleUz: body.subtitleUz || null,
      ctaText: body.ctaText || null,
      ctaLink: body.ctaLink || null,
      order: count,
    },
  })
  return NextResponse.json(banner)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (body.reorder) {
    await Promise.all(body.ids.map((id: string, i: number) =>
      prisma.banner.update({ where: { id }, data: { order: i } })
    ))
    return NextResponse.json({ ok: true })
  }
  const banner = await prisma.banner.update({
    where: { id: body.id },
    data: {
      imageUrl: body.imageUrl,
      titleRu: body.titleRu || null,
      titleUz: body.titleUz || null,
      subtitleRu: body.subtitleRu || null,
      subtitleUz: body.subtitleUz || null,
      ctaText: body.ctaText || null,
      ctaLink: body.ctaLink || null,
    },
  })
  return NextResponse.json(banner)
}
