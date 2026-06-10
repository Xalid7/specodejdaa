import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const partners = await prisma.partner.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(partners)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const count = await prisma.partner.count()
  const p = await prisma.partner.create({ data: { logoUrl: body.logoUrl, name: body.name || null, website: body.website || null, order: count } })
  return NextResponse.json(p)
}
