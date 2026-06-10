import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 60) + '-' + Date.now()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')
  const filter = searchParams.get('filter')
  const search = searchParams.get('search')

  const where: any = {}
  if (categoryId) where.categoryId = categoryId
  if (filter === 'new') where.isNew = true
  if (filter === 'collection') where.isCollection = true
  if (filter === 'holiday') where.isHoliday = true
  if (search) where.OR = [
    { nameRu: { contains: search } },
    { nameUz: { contains: search } },
  ]

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const product = await prisma.product.create({
    data: {
      nameRu: body.nameRu,
      nameUz: body.nameUz,
      descRu: body.descRu || null,
      descUz: body.descUz || null,
      images: JSON.stringify(body.images || []),
      isNew: body.isNew || false,
      isCollection: body.isCollection || false,
      isHoliday: body.isHoliday || false,
      slug: slugify(body.nameRu || body.nameUz || 'product'),
      categoryId: body.categoryId,
    },
    include: { category: true },
  })
  return NextResponse.json(product)
}
