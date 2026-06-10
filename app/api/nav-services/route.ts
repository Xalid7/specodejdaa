import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 40) + '-' + Date.now()
}

export async function GET() {
  const services = await prisma.navService.findMany({ orderBy: { order: 'asc' }, include: { products: true } })
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const count = await prisma.navService.count()
  const s = await prisma.navService.create({
    data: { nameRu: body.nameRu, nameUz: body.nameUz, slug: slugify(body.nameRu || 'service'), order: count },
  })
  return NextResponse.json(s)
}
