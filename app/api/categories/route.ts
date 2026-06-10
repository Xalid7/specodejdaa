import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 40) + '-' + Date.now()
}

export async function GET() {
  const cats = await prisma.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { products: true } } } })
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cat = await prisma.category.create({
    data: { nameRu: body.nameRu, nameUz: body.nameUz, icon: body.icon || null, slug: slugify(body.nameRu || 'cat') },
  })
  return NextResponse.json(cat)
}
