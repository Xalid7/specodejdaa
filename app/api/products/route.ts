import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateDescription } from '@/lib/autodesc'

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '').slice(0, 60) + '-' + Date.now()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')
  const filter = searchParams.get('filter')
  const search = searchParams.get('search')

  const where: any = {}
  if (categoryId) {
    // Agar asosiy kategoriya bo'lsa, subkategoriyalarni ham qo'shamiz
    const subCats = await prisma.category.findMany({ where: { parentId: categoryId }, select: { id: true } })
    const ids = [categoryId, ...subCats.map((c: { id: string }) => c.id)]
    where.categoryId = { in: ids }
  }
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

  // Tavsif bo'sh bo'lsa — avtomatik unikal tavsif yaratamiz (RU + UZ)
  let descRu = body.descRu?.trim() || null
  let descUz = body.descUz?.trim() || null
  if (!descRu || !descUz) {
    const cat = body.categoryId
      ? await prisma.category.findUnique({ where: { id: body.categoryId }, select: { nameRu: true } })
      : null
    const auto = generateDescription(body.nameRu || body.nameUz || '', body.nameUz, cat?.nameRu)
    descRu = descRu || auto.descRu
    descUz = descUz || auto.descUz
  }

  const product = await prisma.product.create({
    data: {
      nameRu: body.nameRu,
      nameUz: body.nameUz,
      descRu,
      descUz,
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
