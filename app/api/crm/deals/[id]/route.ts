import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const deal = await prisma.crmDeal.findUnique({
    where: { id },
    include: {
      stage: true,
      contact: true,
      tasks: true,
      invoices: { include: { payments: true } },
      activities: { orderBy: { createdAt: 'desc' } },
    }
  })
  if (!deal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(deal)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  const data = await req.json()
  const deal = await prisma.crmDeal.update({
    where: { id },
    data,
    include: { stage: true, contact: true }
  })
  return NextResponse.json(deal)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params
  await prisma.crmDeal.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
