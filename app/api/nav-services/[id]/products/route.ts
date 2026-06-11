import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = await prisma.serviceProduct.findMany({ where: { navServiceId: id } })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const p = await prisma.serviceProduct.create({
    data: { nameRu: body.nameRu, nameUz: body.nameUz || '', imageUrl: body.imageUrl || null, descRu: body.descRu || null, descUz: body.descUz || null, navServiceId: id }
  })
  return NextResponse.json(p)
}
